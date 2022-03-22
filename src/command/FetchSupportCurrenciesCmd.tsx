import {flowOf} from "../core/Flow";
import {ICurrency} from "../component/currency-dropdown/CurrencyDropDown";


export class FetchSupportCurrenciesCmd {
    flow = flowOf<ICurrency[]>([
        {currency: "SGD", flagIcon: "flag/sgd.svg"},
        {currency: "CNY", flagIcon: "flag/cny.svg"},
        {currency: "HKD", flagIcon: "flag/hkd.svg"},
        {currency: "MYR", flagIcon: "flag/myr.svg"},
    ])
}