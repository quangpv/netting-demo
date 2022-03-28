import {ITransaction} from "../../component/upload-transaction/UploadedSection";
import {NettingStatus} from "../enumerate/NettingStatus";


export interface IExcludedTransaction {
    reason: string;
    billAmount: string;
    counterParty: string;
    tranType: string;
    tranId: string;
    due: string;
    date: string;

}

export interface INettedTransaction {
    localCurrency: string;
    billCurrency: string;
    localAmount: string;
    feeSaved: string;
    billAmount: string;
    counterParty: string;
    tranType: string;
    tranId: string;
    due: string;
    date: string;
}

export interface ICashSaving {
    beforeAmount: string
    afterAmount: string
    savingPercent: string
    savingAmount: string
    afterPercent: string
}

export interface INettingReport {
    reportName: string
    before: string
    after: string
}

export interface CashReport {
    type_CashReport?: string | "CashReport"
    currency: string
}

export function isCashReport(object: any): object is CashReport {
    return 'type_CashReport' in object;
}

export interface IEstimatedSaving {
    fee: ICashSaving
    cashFlow: ICashSaving
    potentialPercent: string
}

export interface NetCash {
    settlementResult: string
}

function isNetCash(object: any): object is NetCash {
    return 'settlementResult' in object;
}

export interface IAmount {
    currency: string
    amount: string
}

export interface IChangeableAmount extends IAmount {
    isIncrease?: boolean;
}

export interface INettingCycle {
    date: string
    nettingId: string
    status: NettingStatus
    settlement: string
    group: string
    nettedTranCount: string
    netCashFlow: IChangeableAmount
    receivable: IAmount
    payable: IAmount
    fee: IAmount
    cashFlow: IAmount
}


export interface INettingParam {
    from: string
    to: string
    margin: string
    fee: string
    min: string
    max: string
    fx: string
    fixed: string
    location: string
    destination: string

    exportData: any
}

export interface ITransactionFile {
    file: File;
    name: string
    size: string
    transactions: ITransaction[]
}

export interface IFileLoading {
    isLoading: boolean
    fileName?: String | null
}