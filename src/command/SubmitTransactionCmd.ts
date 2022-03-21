import {flowOf} from "../core/Flow";
import {RemoteSource} from "../datasource/RemoteSource";
import {LocalSource} from "../datasource/LocalSource";
import {Injectable} from "../core/Injection";
import {ITransactionFile} from "../model/ui/Models";
import {Command} from "./Command";

@Injectable([RemoteSource, LocalSource])
export class SubmitTransactionCmd extends Command {
    flow = flowOf(0)
    private job: NodeJS.Timeout;

    constructor(private remoteSource: RemoteSource,
                private localSource: LocalSource) {
        super();
    }

    invoke(file: ITransactionFile, nettingId: string) {
        this.job = setTimeout(() => {
            this.flow.emit(1)
            this.run(async () => {
                await this.remoteSource.uploadTransactions(nettingId, file.file)
                this.flow.emit(2)

                let result = await this.remoteSource.fetchNettingById(nettingId)
                this.localSource.saveNettingDetail(nettingId, result)
                this.flow.emit(3)
            })
        }, 1000)
    }

    reset() {
        if (this.job) clearTimeout(this.job)
        this.flow.emit(0)
    }
}