import {Flow} from "./Flow";

export interface Command {
    execute()
}

export interface ViewModelProps<T extends ViewModel<any>> {
    viewModel: T
}

export abstract class ViewModel<S> {
    state: Flow<S>

    onDetached() {
    }

    onAttached() {
    }

    protected execute(command: Command, error: Flow<Error> | null = null, loading: Flow<Boolean> | null = null) {
        this.launch(() => command.execute(), error, loading)
    }

    protected launch(block: () => any, error: Flow<Error> | null = null, loading: Flow<Boolean> | null = null) {
        if (loading != null) loading.emit(true)
        try {
            let result = block();
            if (result instanceof Promise) {
                result.catch((e) => {
                    this.handleError(e, error)
                })
            }
        } catch (e) {
            this.handleError(e as Error, error)
        } finally {
            if (loading != null) loading.emit(false)
        }
    }

    private handleError(e: Error, errorFlow: Flow<Error> | null = null) {
        if (errorFlow != null) {
            errorFlow.emit(e)
            return
        }
    }
}