import {Injectable} from "../core/Injection";
import {LocalSource} from "../datasource/LocalSource";
import {AppValidator} from "../app/AppValidator";
import {SingleFlow} from "../core/Flow";
import {Command} from "./Command";
import {RemoteSource} from "../datasource/RemoteSource";


@Injectable([LocalSource, AppValidator, RemoteSource])
export class LoginCmd extends Command {
    result = new SingleFlow<any>();

    constructor(
        private localSource: LocalSource,
        private validator: AppValidator,
        private removeSource: RemoteSource
    ) {
        super();
    }

    invoke(form: FormData) {
        this.run(async () => {
            let email = form.get("email") as string
            this.validator.checkEmail(email)
            const token = await this.removeSource.login(form)
            this.localSource.saveToken(token.accessToken)
            this.localSource.saveEmail(email)
            this.result.call()
        })
    }
}