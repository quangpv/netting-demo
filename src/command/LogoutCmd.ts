import {LocalSource} from "../datasource/LocalSource";
import {Injectable} from "../core/Injection";

@Injectable([LocalSource])
export class LogoutCmd {
    constructor(private localSource: LocalSource) {
    }

    execute() {
        this.localSource.removeEmail()
        this.localSource.removeToken()
    }
}