import {flowOf} from "../core/Flow";
import {ICurrency} from "../component/currency-dropdown/CurrencyDropDown";


export class FetchSupportCurrenciesCmd {
    private initial: ISupportCurrencies = {
        home: ["SGD", "AUD", "CAD", "CHF", "CNY", "EUR", "GBP", "HKD", "IDR", "INR", "JPY", "KRW", "MYR", "NZD", "PHP", "RUB", "THB", "TRY", "USD", "VND"]
            .map(this.currency),
        invoice: ["SGD", "AUD", "CAD", "CHF", "EUR", "GBP", "HKD", "IDR", "INR", "JPY", "MYR", "NZD", "USD"]
            .map(this.currency)
    }
    flow = flowOf<ISupportCurrencies>(this.initial)

    private currency(currency: string): ICurrency {
        return {
            currency: currency,
            flagIcon: `flag/${currency.toLowerCase()}.svg`
        };
    }
}

export interface ISupportCurrencies {
    invoice: ICurrency[]
    home: ICurrency[]
}