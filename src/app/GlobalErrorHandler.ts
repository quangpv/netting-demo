import {Flow, SingleFlow} from "../core/Flow";

export class GlobalErrorHandler {
    handle(error: Error) {
        throw Error("Not support yet")
    }
}

export class LogGlobalErrorHandler extends GlobalErrorHandler {
    handle(error: Error) {
        console.log(error)
    }
}

export class RegistrableGlobalErrorHandler extends GlobalErrorHandler {
    readonly error: Flow<Error>

    constructor() {
        super();
        this.error = new SingleFlow<Error>()
    }

    handle(error: Error) {
        console.log(error)
        this.error.emit(error)
    }
}