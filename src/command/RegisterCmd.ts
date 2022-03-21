import {Injectable} from "../core/Injection";
import {LocalSource} from "../datasource/LocalSource";
import {AppValidator} from "../app/AppValidator";
import {SingleFlow} from "../core/Flow";
import {Command} from "./Command";
import {RemoteSource} from "../datasource/RemoteSource";

@Injectable([LocalSource, AppValidator, RemoteSource])
export class RegisterCmd extends Command {
    result = new SingleFlow();

    constructor(
        private localSource: LocalSource,
        private validator: AppValidator,
        private remoteSource: RemoteSource
    ) {
        super();
    }

    invoke(form: FormData) {
        this.run(async () => {
            let email = form.get("email") as string
            let name = form.get("name") as string
            this.validator.checkEmail(email)
            this.validator.checkName(name)
            const token = await this.remoteSource.registry(form)
            this.localSource.saveEmail(email)
            this.localSource.saveToken(token.accessToken)
            this.result.call()
        })
    }
}