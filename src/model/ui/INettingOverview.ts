export interface INettingOverview {
    month: string;
    cashSaved: ICashSaved;
    feeSaved: ICashSaved;
    cashFlow: ICashFlow
}

export interface ICashFlow {
    flowAmount: string;
    currency: string;
    payAmount: string;
    receiveAmount: string;

    flowPercent: string
    payPercent: string
    receivePercent: string
}

export interface ICashSaved {
    savedList?: IMonthSaved[];
    amountYTD: string;
    amountThisMonth: string;
    currency: string;
}

export interface IMonthSaved {
    month: string
    heightRate: number
}