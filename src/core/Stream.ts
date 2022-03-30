import {Closable, Collector} from "./Flow";
import {ArrayList} from "./ArrayList";
import {useEffect, useState} from "react";
import {extension} from "./extension";

export abstract class Stream<T> {
    abstract collect(param: Collector<T>): Closable
}

export abstract class StatableStream<T> extends Stream<T> {
    abstract getValue(): T
}

export class SourceStream<T> extends StatableStream<T> {
    private mValue: T;
    private mCollectors: ArrayList<Collector<T>> = new ArrayList();

    emit(value: T) {
        this.mValue = value
        this.mCollectors.forEach(it => {
            it(value)
        })
    }

    collect(param: Collector<T>) {
        if (this.mValue) {
            param(this.mValue)
        }
        this.mCollectors.push(param)
        return () => {
            this.mCollectors.remove(param)
        }
    }

    getValue() {
        return this.mValue;
    }
}

export class ChannelStream<T> extends Stream<T> {
    constructor(private onCollect: (channel: Channel<T>) => Closable) {
        super();
    }

    collect(param: Collector<T>) {
        let channel: Channel<T> = {
            send(value: T) {
                param(value)
            }
        }
        return this.onCollect(channel)
    }
}

class StateStream<T> extends StatableStream<T> {

    private mValue: T;

    constructor(def: T, private onCollect: (channel: Channel<T>) => Closable) {
        super();
        this.mValue = def
    }

    collect(param: Collector<T>): Closable {
        let channel: Channel<T> = {
            send: (value: T) => {
                if (this.mValue !== value) {
                    this.mValue = value
                    param(this.mValue)
                }
            }
        }
        return this.onCollect(channel);
    }

    getValue(): T {
        return this.mValue;
    }
}

interface Channel<T> {
    send(value: T)
}

export interface StatableStream<T> {
    asState(): T
}

export interface Stream<T> {
    map<V>(transform: (value: T) => V): Stream<V>

    filter(accept: (value: T) => Boolean): Stream<T>

    state(def: T): StatableStream<T>
}

export class StreamExt {

    @extension(Stream)
    static map<T, V>(self: Stream<T>, transform: (value: T) => V) {
        return new ChannelStream<V>(channel => {
            return self.collect(it => {
                channel.send(transform(it))
            })
        })
    }

    @extension(Stream)
    static filter<T>(self: Stream<T>, accept: (value: T) => Boolean) {
        return new ChannelStream<T>(channel => {
            return self.collect(it => {
                if (accept(it)) channel.send(it)
            })
        })
    }

    @extension(Stream)
    static state<T>(self: Stream<T>, def: T): StateStream<T> {
        return new StateStream<T>(def, channel => {
            return self.collect(it => {
                channel.send(it)
            })
        })
    }

    @extension(StatableStream)
    static asState<T>(self: StatableStream<T>): T {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let [state, setState] = useState(self.getValue)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => self.collect(it => {
            setState(it)
        }), [self, state])
        return state
    }
}

function combineStream<A, B, C>(stream: SourceStream<A>, stream1: SourceStream<B>, transform: (a: A, b: B) => C) {
    return new ChannelStream<C>(channel => {
        let result1: A
        let result2: B

        function notifyChange() {
            if (result1 && result2) {
                channel.send(transform(result1, result2))
            }
        }

        let job1 = stream.collect(it => {
            result1 = it
            notifyChange()
        })

        let job2 = stream1.collect(it => {
            result2 = it
            notifyChange()
        })
        return () => {
            job1()
            job2()
        }
    })
}


function test() {
    let stream = new SourceStream<string>()
    let stream1 = new SourceStream<string>()
    stream.map(it => "").state("").asState()

    stream.emit("Hello world")

    stream.map(it => it + "/Test").collect(it => {

    })
    stream.map(it => it + "/Test").state("Hello").asState()
    stream.asState()

    combineStream(stream, stream1, (a, b) => {
        return a + b
    }).collect(it => {

    })
}
