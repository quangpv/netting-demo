import {Injectable} from "../core/Injection";
import {RemoteSource} from "../datasource/RemoteSource";
import {Command} from "./Command";
import {flowOf, SingleFlow} from "../core/Flow";


@Injectable([RemoteSource])
export class CreateNettingCmd extends Command {
    success = new SingleFlow<string>();
    loading = flowOf(false)

    constructor(private remoteSource: RemoteSource) {
        super();
    }

    invoke(groupName: string) {
        this.run(async () => {
            try {
                this.loading.emit(true)
                const data = await this.remoteSource.createNetting(groupName)
                this.success.emit(data.id)
            } finally {
                this.loading.emit(false)
            }
        })
    }
}