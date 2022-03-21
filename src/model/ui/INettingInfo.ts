import {NettingStatus} from "../enumerate/NettingStatus";
import {IPaymentCard} from "../../component/payment-card/PaymentCard";
import {IEstimatedSaving, IExcludedTransaction, INettedTransaction, INettingReport} from "./Models";

export interface INettingFile {
    name: string
    size: string
}

export interface INettingInfo {
    description: INettingDesc;
    isInProgress: boolean;
    status: NettingStatus
    nettingId: String

    receivable: IPaymentCard
    payable: IPaymentCard
    netCashFlow: IPaymentCard

    estimatedSaving?: IEstimatedSaving | null
    nettingReports?: INettingReport[] | null
    nettedTransactions?: INettedTransaction[] | null;
    excludedTransactions?: IExcludedTransaction[] | null;
}

export interface INettingDesc {
    payableAmount: string;
    nettingName: string
    date: string

    uploadedFile?: INettingFile | null
    reportFile?: INettingFile | null
}
