import {Injectable} from "../core/Injection";
import {LocalSource} from "../datasource/LocalSource";

@Injectable([LocalSource])
export class RetrieveEmailCmd {

    constructor(private localSource: LocalSource) {
    }

    invoke(): string {
        return this.localSource.emailFlow.getValue()
    }
}
