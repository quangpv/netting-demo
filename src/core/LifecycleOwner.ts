import {ArrayList} from "./ArrayList";
import {Closable} from "./Flow";

export interface LifecycleOwner {
    lifecycle: Lifecycle
}

export interface LifecycleObserver {
    onMount(): void

    onUnmount(): void
}

export interface Lifecycle {
    isMounted: boolean;

    addObserver(observer: LifecycleObserver): void;

    removeObserver(observer: LifecycleObserver): void;

    launch(block: () => Closable): void;
}

export class LifecycleRegistry implements Lifecycle {
    private isActive = false;
    isMounted: boolean = false;
    private observers = new ArrayList<LifecycleObserver>();

    mount(): void {
        this.isMounted = true;
        this.isActive = true
        this.observers.forEach(it => it.onMount())
    }

    unmount(): void {
        this.isMounted = false;
        this.isActive = true
        this.observers.forEach(it => it.onUnmount())
    }

    addObserver(observer: LifecycleObserver) {
        this.observers.push(observer)
        if (!this.isActive) return
        if (this.isMounted) observer.onMount();
        else observer.onUnmount();
    }

    removeObserver(observer: LifecycleObserver): void {
        this.observers.remove(observer)
    }

    launch(block: () => Closable) {
        let self = this;
        let job: Closable = undefined
        this.addObserver({
            onMount: () => {
                job = block()
            },
            onUnmount() {
                self.removeObserver(this)
                if (job !== undefined) job()
            }
        })
    }
}