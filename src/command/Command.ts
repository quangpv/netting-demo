import {GlobalErrorHandler, LogGlobalErrorHandler} from "../app/GlobalErrorHandler";

const logErrorHandler = new LogGlobalErrorHandler()

export abstract class Command {
    private readonly getErrorHandler: () => GlobalErrorHandler = () => logErrorHandler

    run(block: () => any) {
        try {
            let result = block()
            if (result instanceof Promise) {
                return result.catch(e => {
                    this.getErrorHandler().handle(e)
                })
            }
            return result
        } catch (e) {
            this.getErrorHandler().handle(e)
        }
    }
}