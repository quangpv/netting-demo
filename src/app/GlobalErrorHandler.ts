import {Flow, SingleFlow} from "../core/Flow";
import {container} from "tsyringe";
import {LocalSource} from "../datasource/LocalSource";
import {ApiError, InvalidTokenError} from "../exception/AppError";

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
        let err = error
        if (error.message.toLowerCase() === "token invalid") {
            container.resolve(LocalSource).removeToken()
            err = new InvalidTokenError();
        }
        console.log(error)

        this.error.emit(err)
    }
}