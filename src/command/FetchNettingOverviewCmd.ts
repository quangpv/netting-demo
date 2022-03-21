import {flowOf} from "../core/Flow";
import {ICashSaved, IMonthSaved, INettingOverview} from "../model/ui/INettingOverview";
import {Command} from "./Command";
import {Injectable} from "../core/Injection";
import {NettingOverviewDTO, RemoteSource} from "../datasource/RemoteSource";
import {TextFormatter} from "../app/TextFormatter";
import {LocalSource} from "../datasource/LocalSource";

@Injectable([RemoteSource, TextFormatter, LocalSource])
export default class FetchNettingOverviewCmd extends Command {
    private ICashSavedDefault: ICashSaved = {
        amountThisMonth: "-",
        amountYTD: "-",
        currency: "EUR",
    }

    private INettingOverviewDefault: INettingOverview = {
        month: "-",
        cashFlow: {
            flowAmount: "-",
            currency: "EUR",
            payAmount: "-",
            receiveAmount: "-",
            payPercent: "0%",
            receivePercent: "0%",
            flowPercent: "0%"
        },
        cashSaved: this.ICashSavedDefault,
        feeSaved: this.ICashSavedDefault
    }
    flow = flowOf<INettingOverview>(this.INettingOverviewDefault);

    constructor(
        private remoteSource: RemoteSource,
        private textFormatter: TextFormatter,
        private localSource: LocalSource
    ) {
        super();
        this.run(async () => {
            let result = this.localSource.getOverview()
            if (result != null) this.flow.emit(this.create(result))

            result = await this.remoteSource.fetchNettingOverview()
            this.localSource.saveOverview(result)
            this.flow.emit(this.create(result))
        })
    }

    private create(result: NettingOverviewDTO): INettingOverview {
        let isOpen = result.payable === 0.0 && result.receivable === 0.0
        let cashSaved = result.cashFlowSaved
        let feeSaved = result.feeSaved
        let currency = result.currency

        if (isOpen) {
            return {
                ...this.INettingOverviewDefault,
                month: this.textFormatter.formatYearMonth(result.month),
                cashSaved: {
                    ...this.ICashSavedDefault,
                    savedList: cashSaved.savedList.map(it => this.createMonthSaved(it, 0))
                },
                feeSaved: {
                    ...this.ICashSavedDefault,
                    savedList: feeSaved.savedList.map(it => this.createMonthSaved(it, 0))
                }
            }
        }

        let payPerReceive = result.receivable === 0 ? 0 : result.payable / result.receivable
        let receivePerPay = result.payable === 0 ? 0 : result.receivable / result.payable

        let payRatio = result.payable > result.receivable ? 1 : payPerReceive
        let receiveRatio = payRatio === 1 ? receivePerPay : 1
        let flowRate = 1 - Math.abs(payRatio - receiveRatio)
        return {
            month: this.textFormatter.formatYearMonth(result.month),
            cashFlow: {
                flowAmount: this.textFormatter.formatAmount(result.cashFlow),
                currency: currency,
                payAmount: this.textFormatter.formatAmount(result.payable),
                receiveAmount: this.textFormatter.formatAmount(result.receivable),

                payPercent: `${(payRatio * 100).toFixed(2)}%`,
                receivePercent: `${(receiveRatio * 100).toFixed(2)}%`,
                flowPercent: `${(flowRate * 100).toFixed(2)}%`
            },
            cashSaved: this.createSaved(cashSaved, currency),
            feeSaved: this.createSaved(feeSaved, currency),
        };
    }

    private createMonthSaved(it: { amount: number; month: string }, savedMax: number): IMonthSaved {
        return {
            month: this.textFormatter.formatMonth(it.month),
            heightRate: savedMax === 0 ? 0 : it.amount / savedMax
        };
    }

    private maxOf(savedList: [{ amount: number; month: string }]) {
        let max = 0
        savedList.forEach(it => {
            if (it.amount > max) {
                max = it.amount
            }
        })
        return max
    }

    private createSaved(
        cashSaved: { savedInMonth: number; savedList: [{ amount: number; month: string }]; savedYTD: number },
        currency: string,
    ): ICashSaved {
        let savedMax = this.maxOf(cashSaved.savedList)
        return {
            amountYTD: this.textFormatter.formatAmount(cashSaved.savedYTD),
            amountThisMonth: this.textFormatter.formatAmount(cashSaved.savedInMonth),
            currency: currency,
            savedList: cashSaved.savedList.map(it => this.createMonthSaved(it, savedMax))
        };
    }
}