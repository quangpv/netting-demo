import {Injectable} from "../core/Injection";
import {RemoteSource} from "../datasource/RemoteSource";
import {LocalSource} from "../datasource/LocalSource";
import {Command} from "./Command";
import {SingleFlow} from "../core/Flow";


@Injectable([RemoteSource, LocalSource])
export class PayCmd extends Command {
    success = new SingleFlow();

    constructor(private remoteSource: RemoteSource, private localSource: LocalSource) {
        super();
    }

    invoke(id: string) {
        this.run(async () => {
            await this.remoteSource.payment(id)
            let result = await this.remoteSource.fetchNettingById(id)
            this.localSource.saveNettingDetail(id, result)
            this.success.call()
        })
    }
}