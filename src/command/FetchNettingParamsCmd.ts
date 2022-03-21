import {Flow, flowOf} from "../core/Flow";
import {FilterParams} from "../pages/exchange-rate/ExchangeRatePage";
import {INettingParam} from "../model/ui/Models";
import {NettingParamDTO, RemoteSource} from "../datasource/RemoteSource";
import {Injectable} from "../core/Injection";
import {Command} from "./Command";
import {LocalSource} from "../datasource/LocalSource";

@Injectable([RemoteSource, LocalSource])
export class FetchNettingParamsCmd extends Command {
    flow: Flow<INettingParam[]> = flowOf([]);

    constructor(private remoteSource: RemoteSource, private localSource: LocalSource) {
        super();
    }

    invoke(filterOptions: FilterParams) {

        this.run(async () => {
            let data = this.localSource.getNettingParams()
            if (data != null) {
                this.flow.emit(data.filter(it => this.accept(filterOptions, it)).map(it => this.create(it)))
            }
            const result = await this.remoteSource.fetchNettingParams()
            this.localSource.saveNettingParams(result.data)
            this.flow.emit(result.data.filter(it => this.accept(filterOptions, it)).map(it => this.create(it)))
        })
    }

    private create(it: NettingParamDTO): INettingParam {
        return {
            destination: it.destinationLocations,
            fee: it.fee.toFixed(2),
            fixed: it.fixedFee.toFixed(2),
            from: it.fromCurrency.toString(),
            fx: it.exchangeRate.toString(),
            location: it.atLocation.toString(),
            margin: it.margin.toFixed(2),
            max: it.maxFee.toFixed(2),
            min: it.minFee.toFixed(2),
            to: it.toCurrency
        };
    }

    private accept(filterOptions: FilterParams, item: NettingParamDTO) {
        return this.contains(item.fromCurrency, filterOptions.from) &&
            this.contains(item.toCurrency, filterOptions.to) &&
            this.contains(item.atLocation, filterOptions.location) &&
            this.contains(item.destinationLocations, filterOptions.destination)
    }

    private contains(from: string, collections: string) {
        if (collections.length === 0) return true
        return collections.split(",").map(it => it.trim()).includes(from)
    }
}