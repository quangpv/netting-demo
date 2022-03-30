import {Injectable} from "../core/Injection";
import {RemoteSource} from "../datasource/RemoteSource";
import {TextFormatter} from "../app/TextFormatter";
import {Command} from "./Command";
import {flowOf} from "../core/Flow";
import {ICurrency} from "../component/currency-dropdown/CurrencyDropDown";
import {tryWith} from "./SubmitTransactionCmd";
import {CompareItemDTO, ComparisonDTO} from "../model/response/ComparisonDTO";
import {ICompareItem, IComparison} from "../pages/comparison/RateComparisonPage";

@Injectable([RemoteSource, TextFormatter])
export class CompareCurrencyRateCmd extends Command {
    flow = flowOf<IComparison>(null)
    loading = flowOf(false);

    constructor(private remoteSource: RemoteSource, private textFormatter: TextFormatter) {
        super();
    }

    invoke(current: { home?: ICurrency; invoice?: ICurrency; amount: string }) {
        if (current.home == null || current.invoice == null) {
            return this.flow.emit(null)
        }

        let amount = parseFloat(current.amount)
        this.run(async () => {
            this.loading.emit(true);
            let [data, error] = await tryWith(() => this.remoteSource.compare(current.home.currency, current.invoice.currency, amount))
            if (error) {
                this.flow.emit(null);
                this.loading.emit(false);
                throw error
            }
            this.flow.emit({
                homeCurrency: data.homeCurrency,
                invoiceCurrency: data.invoiceCurrency,
                exchangeRate: data.exchangeRate.toString(),
                lastTime: data.lastTime,
                items: data.compares.map(it => this.createCompareItem(it, data))
            })
            this.loading.emit(false);
        })

    }

    private createCompareItem(item: CompareItemDTO, data: ComparisonDTO): ICompareItem {
        let isOHN = item.name === "OneHypernet"
        let currency = data.homeCurrency
        let transferFee = isOHN ? "-" : this.textFormatter.formatCash(currency, item.transferFee)
        let loss = isOHN ? "-" : this.textFormatter.formatCash(currency, item.loss)
        return {
            exchangeRate: `1 ${data.homeCurrency} = ${item.exchangeRate} ${data.invoiceCurrency}`,
            orgImage: item.logo,
            orgName: item.name,
            totalPayment: this.textFormatter.formatCash(currency, item.totalPayment),
            transferFee: transferFee,
            loss: loss,
            isOHN: isOHN
        };
    }
}