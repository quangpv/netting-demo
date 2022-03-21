import {flowOf} from "../core/Flow";
import {IAmount, INettingCycle} from "../model/ui/Models";
import {NettingStatus, nettingStatusOfName} from "../model/enumerate/NettingStatus";
import {Command} from "./Command";
import {Injectable} from "../core/Injection";
import {NettingCycleDTO, RemoteSource} from "../datasource/RemoteSource";
import {TextFormatter} from "../app/TextFormatter";
import {LocalSource} from "../datasource/LocalSource";

@Injectable([RemoteSource, TextFormatter, LocalSource])
export class FetchNettingListCmd extends Command {
    flow = flowOf<INettingCycle[]>([]);

    constructor(private remoteSource: RemoteSource,
                private textFormatter: TextFormatter,
                private localSource: LocalSource) {
        super();
        this.run(async () => {
            let data = this.localSource.getNettingCycles()
            if (data != null) {
                this.flow.emit(data.map(it => this.create(it)))
            }
            let result = await this.remoteSource.fetchNettingCycles()
            data = result.data
            this.localSource.saveNettingCycles(data)
            this.flow.emit(data.map(it => this.create(it)))
        });
    }

    private create(item: NettingCycleDTO): INettingCycle {
        let status = nettingStatusOfName(item.status)
        const amountDefault: IAmount = {
            amount: "-", currency: ""
        }
        let isOpen = status <= NettingStatus.Open
        let isIncrease = isOpen ? null : item.payable.amount > item.receivable.amount

        let netCashFlow = isOpen ? {...amountDefault, isIncrease: null} : {
            currency: item.savingCash.currency,
            amount: this.textFormatter.formatAmount(item.savingCash.amount),
            isIncrease: isIncrease
        }
        let receivable = isOpen ? amountDefault : {
            currency: item.receivable.currency,
            amount: this.textFormatter.formatAmount(item.receivable.amount),
        }
        let payable = isOpen ? amountDefault : {
            currency: item.payable.currency,
            amount: this.textFormatter.formatAmount(item.payable.amount),
        }
        let fee = isOpen ? amountDefault : {
            currency: item.savingFee.currency,
            amount: this.textFormatter.formatAmount(item.savingFee.amount),
        }
        let cashFlow = isOpen ? amountDefault : {
            currency: item.savingCash.currency,
            amount: this.textFormatter.formatAmount(item.savingCash.amount),
        }
        return {
            date: this.textFormatter.formatDate(item.createAt),
            nettingId: item.id,
            status: status,
            settlement: this.textFormatter.formatDate(item.settlementDate),
            group: item.group,
            nettedTranCount: isOpen ? "-" : item.transactionCount.toString(),
            netCashFlow: netCashFlow,
            receivable: receivable,
            payable: payable,
            fee: fee,
            cashFlow: cashFlow,
        };
    }
}