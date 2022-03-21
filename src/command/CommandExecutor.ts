import {GlobalErrorHandler} from "../app/GlobalErrorHandler";
import {Singleton} from "../core/Injection";

@Singleton([GlobalErrorHandler])
export class CommandExecutor {

    constructor(private errorHandler: GlobalErrorHandler) {
    }

    execute(block: () => any) {
        try {
            let result = block()
            if (result instanceof Promise) {
                result.catch(e => {
                    this.errorHandler.handle(e)
                })
            }
        } catch (e) {
            this.errorHandler.handle(e)
        }
    }
}