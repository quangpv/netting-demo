import {LocalSource} from "../datasource/LocalSource";
import {Injectable} from "../core/Injection";

@Injectable([LocalSource])
export class CheckLoginCmd {
    constructor(private localSource: LocalSource) {
    }

    isLogged(): boolean {
        let token = this.localSource.getToken()
        return token != null
    }
}
