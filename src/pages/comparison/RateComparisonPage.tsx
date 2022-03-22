import "./rate-comparison.css"
import AppIcon from "../../component/AppIcon";
import {useService} from "../../core/Injection";
import {CurrencyDropDown, ICurrency} from "../../component/currency-dropdown/CurrencyDropDown";
import {FetchSupportCurrenciesCmd} from "../../command/FetchSupportCurrenciesCmd";
import {flowOf} from "../../core/Flow";
import {ChangeEvent, useState} from "react";

export interface ICompareItem {
    orgName: string
    orgImage: string
    exchangeRate: string
    transferFee: string
    totalPayment: string
    loss: string
}

export interface IComparison {
    fromCurrency: string;
    toCurrency: string;
    exchangeRate: string;
    lastTime: string;

    items?: ICompareItem[]
}

export default function RateComparisonPage() {
    const initPaired = {from: null, to: null, amount: "0"}
    let [paired, setPaired] = useState(initPaired)
    let supportCurrencies = useService(FetchSupportCurrenciesCmd).flow.asState()
    let comparisonCmd = useService(ExchangeCurrencyCmd)
    let comparison = comparisonCmd.flow.asState()

    let onFromCurrencyClick = (item) => {
        setPaired({...paired, from: item})
    }
    let onToCurrencyClick = (item) => {
        setPaired({...paired, to: item})
    }
    let onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPaired({...paired, amount: e.currentTarget.value})
    }
    let onClearClick = () => {
        setPaired(initPaired)
        comparisonCmd.invoke(initPaired)
    }
    let onCompareClick = () => {
        comparisonCmd.invoke(paired)
    }
    return <div className={"rate-comparison"}>
        <div className={"compare-filter"}>
            <label>Invoice Currency</label>
            <CurrencyDropDown items={supportCurrencies} onItemClick={onFromCurrencyClick} selected={paired.from}/>

            <label>Amount</label>
            <input type={"text"} placeholder={"Enter Amount"} value={paired.amount} onChange={onAmountChange}/>

            <label>Home currency</label>
            <CurrencyDropDown items={supportCurrencies} onItemClick={onToCurrencyClick} selected={paired.to}/>

            <label>Interbank exchange rate</label>
            <div className={"compare-fx"}>
                {
                    comparison != null ? <>
                        <h3>1 {comparison.fromCurrency} = {comparison.exchangeRate} {comparison.toCurrency}</h3>
                        <span>{comparison.lastTime}</span>
                    </> : <>
                        <h3>-</h3>
                        <span>-</span>
                    </>
                }

            </div>
            <div className={"compare-action"}>
                <button onClick={onClearClick}>Clear</button>
                <button onClick={onCompareClick}>Compare <AppIcon src={"ic_compare.svg"}/></button>
            </div>
        </div>
        <div className={"divider-horizontal"}/>
        <div className={"compare-content"}>
            {
                comparison?.items == null ?
                    <span>Please select Invoice Currency, Amount, Home Currency and click Compare to generate comparison</span>
                    : <table style={{alignSelf:"self-start"}}>
                        <thead>
                        <tr>
                            <td/>
                            <td>Exchange rate</td>
                            <td>Transfer fee</td>
                            <td>Total payment</td>
                            <td>Loss</td>
                        </tr>
                        </thead>
                        <tbody>
                        {comparison.items.map(it => <tr>
                            <td>{it.orgName}</td>
                            <td>{it.exchangeRate}</td>
                            <td>{it.transferFee}</td>
                            <td>{it.totalPayment}</td>
                            <td>{it.loss}</td>
                        </tr>)}
                        </tbody>
                    </table>
            }
        </div>
    </div>
}

export class ExchangeCurrencyCmd {
    flow = flowOf<IComparison>(null)

    invoke(current: { from?: ICurrency; to?: ICurrency; amount: string }) {
        if (current.from == null || current.to == null) {
            return this.flow.emit(null)
        }
        let rate = "1.0"
        return this.flow.emit({
            fromCurrency: current.from?.currency,
            toCurrency: current.to?.currency,
            exchangeRate: rate,
            lastTime: "2 minutes ago",
            items: [
                {
                    orgName: "Onehypernet",
                    orgImage: "",
                    exchangeRate: `1 ${current.from.currency} = ${rate} ${current.to.currency}`,
                    transferFee: "-",
                    totalPayment: current.amount,
                    loss: "-"
                }
            ]
        })
    }
}