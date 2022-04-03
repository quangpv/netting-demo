import {PipeFlow} from "../core/Flow";
import {CashReport, ICashSaving, IEstimatedSaving, INettedTransaction, INettingReport} from "../model/ui/Models";
import {NettingStatus, nettingStatusOfName} from "../model/enumerate/NettingStatus";
import {Command} from "./Command";
import {RemoteSource} from "../datasource/RemoteSource";
import {Injectable} from "../core/Injection";
import {NettedTransactionDTO, NettingDetailDTO} from "../model/response/NettingDetailDTO";
import {INettingFile, INettingInfo} from "../model/ui/INettingInfo";
import {TextFormatter} from "../app/TextFormatter";
import {LocalSource} from "../datasource/LocalSource";
import {IPaymentCard} from "../component/payment-card/PaymentCard";
import {ArrayList} from "../core/ArrayList";
import {TransactionType, transactionTypeOf} from "../model/enumerate/TransactionType";
import {IInsight} from "../component/cash-insight-dialog/CashInsightChart";

@Injectable([RemoteSource, TextFormatter, LocalSource])
export class FetchNettingInfoCmd extends Command {
    private initState: INettingInfo = {
        insights: [],
        description: {
            payableAmount: "EUR 0.0",
            nettingName: "Test Netting",
            date: "02-11-2021",
        },
        isInProgress: false,
        status: NettingStatus.None,
        nettingId: "N123423423",
        receivable: {
            currency: "SGD",
            amount: "-",
            transactionCount: "-",
            partner: "-"
        },
        payable: {
            currency: "SGD",
            amount: "-",
            transactionCount: "-",
            partner: "-"
        },
        netCashFlow: {
            currency: "SGD",
            amount: "-",
            transactionCount: "-",
            partner: "-"
        }
    }
    flow = new PipeFlow<INettingInfo>();

    constructor(
        private remoteSource: RemoteSource,
        private textFormatter: TextFormatter,
        private localSource: LocalSource
    ) {
        super();
        this.flow.or(this.initState)
    }

    invoke(id: string) {
        this.flow.connect(this.localSource.getNettingDetailFlow(id).map(it => this.create(it)))
        this.run(async () => {
            let response = await this.remoteSource.fetchNettingById(id)
            this.localSource.saveNettingDetail(id, response)
        })
    }

    private createCashSaving(saving: { after: number; before: number; savingAmount: number; savingPercent: number }): ICashSaving {
        if (saving == null) return {
            afterAmount: "0.00", afterPercent: "0%", beforeAmount: "0.00", savingAmount: "0%", savingPercent: "0%"
        }
        let savingPercent = 100 - saving.savingPercent
        return {
            beforeAmount: this.textFormatter.formatAmount(saving.before),
            afterAmount: this.textFormatter.formatAmount(saving.after),
            savingAmount: this.textFormatter.formatAmount(saving.savingAmount),
            savingPercent: `${savingPercent === 100 && saving.after > 0 ? 99 : savingPercent}%`,
            afterPercent: `${saving.savingPercent}%`
        };
    }

    private create(response: NettingDetailDTO): INettingInfo {
        let status = nettingStatusOfName(response.status)
        let isOpening = status <= NettingStatus.Open
        let uploadedFile: INettingFile = isOpening ? null : {
            name: response.uploadedFile.name,
            size: this.textFormatter.formatSize(response.uploadedFile.size),
        }
        let reportFile: INettingFile = isOpening ? null : {
            name: response.reportFile.name,
            size: this.textFormatter.formatSize(response.reportFile.size),
        }
        let payable = this.createPaymentCard(response.currency, response.payable)
        let receivable = this.createPaymentCard(response.currency, response.receivable)
        let cashFlow = this.createPaymentCard(response.currency, response.netCashFlow)

        let estimateSaving: IEstimatedSaving = isOpening ? this.initState.estimatedSaving : {
            fee: this.createCashSaving(response.savingFee),
            cashFlow: this.createCashSaving(response.savingCash),
            potentialPercent: `${response.potentialPercent.toFixed(0)}%`,
        }
        let summary = response.summary

        let transactionReport: INettingReport = isOpening ? null : {
            reportName: "Transactions",
            before: summary.transactions.before.toFixed(0),
            after: summary.transactions.after.toFixed(0),
        }
        let currencyReport: INettingReport = isOpening ? null : {
            reportName: "Currencies",
            before: summary.currencies.before.toFixed(0),
            after: summary.currencies.after.toFixed(0),
        }
        let feeReport = isOpening ? null
            : this.createCashReport("Fees", response.currency, response.summary.fees)
        let cashReport = isOpening ? null
            : this.createCashReport("Cash Outflow", response.currency, response.summary.cashOutFlow)
        let netPayable = isOpening ? "" : this.textFormatter.formatCash(response.currency, Math.abs(response.netCashFlow.amount))
        let insights = this.createInsights(response.nettedTransactions)

        return {
            isInProgress: !isOpening,
            status: status,
            nettingId: response.id,

            description: {
                payableAmount: netPayable,
                nettingName: response.group,
                date: this.textFormatter.formatDate1(response.createAt),

                uploadedFile: uploadedFile,
                reportFile: reportFile,
            },
            estimatedSaving: estimateSaving,
            excludedTransactions: [],
            nettedTransactions: response.nettedTransactions.map(it => this.createNettedTran(it)),
            nettingReports: [
                transactionReport, currencyReport, feeReport, cashReport
            ].filter(it => it != null),

            netCashFlow: cashFlow,
            payable: payable,
            receivable: receivable,

            insights: insights
        }
    }

    private createPaymentCard(
        currency: string,
        payment: { amount: number; numOfCounterParties: number; numOfTransactions: number }
    ): IPaymentCard {
        if (payment == null) {
            return {amount: "-", currency: "EUR", partner: "-", transactionCount: "-"}
        }
        return {
            currency: currency,
            amount: this.textFormatter.formatAmount(payment.amount),
            transactionCount: payment.numOfTransactions.toString(),
            partner: payment.numOfCounterParties.toString(),
        };
    }

    private createNettedTran(item: NettedTransactionDTO): INettedTransaction {
        return {
            localCurrency: item.localAmount.currency,
            billCurrency: item.billAmount.currency,
            billAmount: this.textFormatter.formatAmount(item.billAmount.amount),
            localAmount: this.textFormatter.formatAmount(item.localAmount.amount),
            counterParty: item.counterParty,
            date: this.textFormatter.formatDate(item.date),
            due: this.textFormatter.formatDate(item.date),
            feeSaved: this.textFormatter.formatAmount(item.feeSaved.amount),
            tranId: item.transactionId,
            tranType: item.type
        };
    }

    private createCashReport(name: string, currency: string, report: { after: number; before: number }): INettingReport & CashReport {
        return {
            currency: currency,
            type_CashReport: "type_CashReport",
            reportName: name,
            before: this.textFormatter.formatAmount(report.before),
            after: this.textFormatter.formatAmount(report.after)
        }
    }

    private createInsights(trans: NettedTransactionDTO[]) {
        let group = new Map<string, ArrayList<string>>()
        trans.forEach(it => {
            const key = it.dueDate
            if (!group.has(key)) {
                group.set(key, new ArrayList())
            }
            const amount = this.textFormatter.formatCash(it.billAmount.currency, it.billAmount.amount)
            const sign = (transactionTypeOf(it.type) === TransactionType.Receivable) ? "+" : "-"

            group.get(key).push(`${sign} ${amount}`)
        })
        const result: IInsight[] = []
        group.forEach((value, key) => {
            result.push({
                cashFlows: value.toArray(),
                month: this.textFormatter.formatDateMonth(key)
            })
        })
        return result
    }
}