import {flowOf} from "../core/Flow";
import {RemoteSource} from "../datasource/RemoteSource";
import {LocalSource} from "../datasource/LocalSource";
import {Injectable} from "../core/Injection";
import {ITransactionFile} from "../model/ui/Models";
import {Command} from "./Command";

export interface IProgress {
    value: number;
    success: boolean;
}

@Injectable([RemoteSource, LocalSource])
export class SubmitTransactionCmd extends Command {
    private readonly initial: IProgress = {success: true, value: 0}
    flow = flowOf<IProgress>(this.initial)

    private job: NodeJS.Timeout;

    constructor(private remoteSource: RemoteSource,
                private localSource: LocalSource) {
        super();
    }

    invoke(file: ITransactionFile, nettingId: string) {
        this.job = setTimeout(() => {
            this.notify(1)
            this.run(async () => {
                let [, error] = await tryWith(() => this.remoteSource.uploadTransactions(nettingId, file.file))

                this.notify(2, error == null)
                if (error) {
                    throw error
                }

                let result = await this.remoteSource.fetchNettingById(nettingId)
                this.localSource.saveNettingDetail(nettingId, result)
                this.notify(3)
            })
        }, 1000)
    }

    reset() {
        if (this.job) clearTimeout(this.job)
        this.notify(0)
    }

    private notify(number: number, success: boolean = true) {
        this.flow.emit({value: number, success: success})
    }
}

export async function tryWith(block: () => any) {
    try {
        let result = block()
        if (result instanceof Promise) {
            return [await result, null]
        }
        return [result, null]
    } catch (e) {
        return [null, e]
    }
}