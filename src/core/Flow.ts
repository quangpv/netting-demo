import {ArrayList} from "./ArrayList";
import {LifecycleOwner} from "./LifecycleOwner";
import {extension} from "./extension";
import {useEffect, useState} from "react";
import {launch} from "./HookExt";

export type Collector<T> = (value: T | null) => void
export declare type  Closable = () => void;

export class Flow<T> {
    private collectors = new ArrayList<CollectorWrapper<T>>()
    private value: T | null = null;
    private version: number = -1;
    private activeCount = 0;

    call() {
        this.emit(null)
    }

    protected onActive() {

    }

    protected onInactive() {

    }

    getVersion() {
        return this.version
    }

    getValue() {
        return this.value;
    }

    collect(collector: Collector<T>): Closable {
        let wrapper = new CollectorWrapper(collector, (wrapper) => {
            this.doRemove(wrapper)
        })
        this.collectors.push(wrapper)
        wrapper.notifyChangeIfNeeded(this.value, this.version)
        this.notifyActiveChangeIfNeeded(this.activeCount + 1)
        return () => wrapper.close()
    }

    removeCollector(collector: Collector<T>) {
        let wrapper = this.collectors.find(it => it.collector === collector)
        if (wrapper == null) return
        this.doRemove(wrapper)
    }

    isActivated() {
        return this.activeCount > 0;
    }

    private doRemove(wrapper: CollectorWrapper<T>) {
        this.collectors.remove(wrapper)
        this.notifyActiveChangeIfNeeded(this.activeCount - 1)
    }

    emit(value: T | null) {
        this.value = value
        this.version += 1;
        this.collectors.forEach(it => {
            it.notifyChangeIfNeeded(this.value, this.version)
        })
    }

    private notifyActiveChangeIfNeeded(newActiveCount: number) {
        if (this.activeCount === 0 && newActiveCount > 0) {
            this.onActive()
        } else if (this.activeCount > 0 && newActiveCount === 0) {
            this.onInactive()
        }
        this.activeCount = newActiveCount
    }
}

class CollectorWrapper<T> implements CollectorWrapper<T> {
    private version: number = -1;
    private flowVersion: number = -1;
    private value: T = null;
    private readonly onDetachedListener: (wrapper: CollectorWrapper<T>) => void;

    constructor(public collector: Collector<T>,
                private onDetached: (wrapper: CollectorWrapper<T>) => void) {
        this.onDetachedListener = onDetached;
    }

    notifyChangeIfNeeded(value: T | null, version: number): void {
        this.flowVersion = version
        this.value = value
        this.doNotifyChangeIfNeeded()
    }

    private doNotifyChangeIfNeeded() {
        if (this.version !== this.flowVersion) {
            this.version = this.flowVersion;
            this.collector(this.value)
        }
    }

    close() {
        this.onDetachedListener(this)
    }
}

export class SingleFlow<T> extends Flow<T> {
    private pending: boolean = false;

    collect(collector: Collector<T>): Closable {
        return super.collect((it) => {
            if (this.pending) {
                collector(it);
                this.pending = false;
            }
        });
    }

    emit(value: T | null) {
        this.pending = true
        super.emit(value);
    }
}

export class MediatorFlow<T> extends Flow<T> {
    private sourceMap = new Map<Flow<any>, Source<any>>();

    addSource<V>(flow: Flow<V>, collector: Collector<V>) {
        if (this.sourceMap.has(flow)) return
        let source = new Source(flow, collector)
        this.sourceMap.set(flow, source)
        if (this.isActivated()) source.plug()
    }

    removeSource<V>(flow: Flow<V>) {
        if (!this.sourceMap.has(flow)) return
        let source = this.sourceMap.get(flow)
        source.unplug()
    }

    protected onActive() {
        this.sourceMap.forEach((k, v) => {
            k.plug()
        })
    }

    protected onInactive() {
        this.sourceMap.forEach((k, v) => {
            k.unplug()
        })
    }
}

export class PipeFlow<T> extends MediatorFlow<T> {
    private mSource: Flow<any>

    addSource<V>(flow: Flow<V>, collector: Collector<V>) {
        if (this.mSource === flow) return
        if (this.mSource != null) super.removeSource(this.mSource)
        super.addSource(flow, collector);
        this.mSource = flow
    }

    connect(source: Flow<T>) {
        this.addSource(source, it => {
            this.emit(it)
        })
    }
}

class Source<V> {
    private flow: Flow<V>
    private readonly collector: Collector<V>;
    private version = -1;

    constructor(flow: Flow<V>, collector: Collector<V>) {
        this.flow = flow
        this.collector = (it) => {
            if (this.version !== flow.getVersion()) {
                this.version = flow.getVersion()
                collector(it)
            }
        }
    }

    plug() {
        this.flow.collect(this.collector)
    }

    unplug() {
        this.flow.removeCollector(this.collector)
    }
}

export interface Flow<T> {
    map<V>(transform: (value: T) => V): Flow<V>

    suspendMap<V>(transform: (value: T) => Promise<V>): Flow<V>

    filter(accept: (value: T) => Boolean): Flow<T>

    collectIn(owner: LifecycleOwner, collector: Collector<T>)

    or(defaultValue: T): Flow<T>

    update(block: (item: T) => void)

    asState(): T | undefined

    subscribe(collector: Collector<T>)
}

export class FlowExt {

    @extension(Flow)
    static map<T, V>(self: Flow<T>, transform: (value: T) => V) {
        let mediator = new MediatorFlow<V>()
        mediator.addSource(self, it => {
            mediator.emit(transform(it))
        })
        return mediator
    }

    @extension(Flow)
    static suspendMap<T, V>(self: Flow<T>, transform: (value: T) => Promise<V>) {
        let mediator = new MediatorFlow<V>()
        mediator.addSource(self, it => {
            transform(it).then(value => {
                mediator.emit(value)
            })
        })
        return mediator
    }

    @extension(Flow)
    static filter<T>(self: Flow<T>, accept: (value: T) => Boolean): Flow<T> {
        let mediator = new MediatorFlow<T>()
        mediator.addSource(self, it => {
            if (accept(it)) mediator.emit(it)
        })
        return mediator
    }

    @extension(Flow)
    static collectIn<T>(self: Flow<T>, owner: LifecycleOwner, collector: Collector<T>) {
        owner.lifecycle.launch(() => self.collect(collector))
    }

    @extension(Flow)
    static or<T>(self: Flow<T>, defaultValue: T): Flow<T> {
        if (self.getValue() == null) self.emit(defaultValue)
        return self
    }

    @extension(Flow)
    static update<T>(self: Flow<T>, block: (item: T) => T) {
        let value = self.getValue();
        if (value != null) {
            block(value)
            self.emit(value)
        }
    }

    @extension(Flow)
    static asState<T>(self: Flow<T>): T | undefined {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let [state, setState] = useState(self.getValue())
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => self.collect(it => {
            setState(it)
        }), [self, state])
        return state
    }

    @extension(Flow)
    static subscribe<T>(self: Flow<T>, collector: Collector<T>) {
        launch(() => self.collect(it => {
            collector(it)
        }))
    }
}

export function combine<A, B>(flow: Flow<A>, flow1: Flow<B>): Flow<[A, B]> {
    return combines(flow, flow1) as Flow<[A, B]>
}

export function combine2<A, B, C>(flow: Flow<A>, flow1: Flow<B>, flow2: Flow<C>): Flow<[A, B, C]> {
    return combines(flow, flow1, flow2) as Flow<[A, B, C]>
}

export function combine3<A, B, C, D>(flow: Flow<A>, flow1: Flow<B>, flow2: Flow<C>, flow3: Flow<D>): Flow<[A, B, C, D]> {
    return combines(flow, flow1, flow2, flow3) as Flow<[A, B, C, D]>
}

function combines(...flows: Flow<any>[]): Flow<any[]> {
    let mediator = new MediatorFlow<any[]>()
    let data = new Array(flows.length);

    function notifyIfNeeded() {
        let count = 0
        data.forEach(item => {
            if (item !== undefined) count += 1
        })
        if (count === flows.length) {
            mediator.emit(data)
        }
    }

    flows.forEach((flow, index) => {
        mediator.addSource(flow, it => {
            data[index] = it
            notifyIfNeeded()
        })
    })
    return mediator
}

export function flowOf<T>(value: T): Flow<T> {
    let flow = new Flow<T>()
    flow.emit(value)
    return flow
}

export function useStates<A, B>(flow: Flow<A>, flow2: Flow<B>) {
    let [state, setState] = useState([
        flow.getValue(),
        flow2.getValue()
    ])
    launch(() => combine(flow, flow2).collect(it => {
        setState(it)
    }))
    return state
}

export function useStates2<A, B, C>(flow: Flow<A>, flow2: Flow<B>, flow3: Flow<C>) {
    let [state, setState] = useState([
        flow.getValue(),
        flow2.getValue(),
        flow3.getValue()
    ])
    launch(() => combine2(flow, flow2, flow3).collect(it => {
        setState(it)
    }))
    return state
}

export function useStates3<A, B, C, D>(flow: Flow<A>, flow2: Flow<B>, flow3: Flow<C>, flow4: Flow<D>) {
    let [state, setState] = useState([flow.getValue(),
        flow2.getValue(),
        flow3.getValue(),
        flow4.getValue(),
    ])
    launch(() => combine3(flow, flow2, flow3, flow4).collect(it => {
        setState(it)
    }))
    return state
}