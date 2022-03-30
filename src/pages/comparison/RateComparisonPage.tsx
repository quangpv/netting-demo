import "./rate-comparison.css"
import AppIcon from "../../component/AppIcon";
import {useService} from "../../core/Injection";
import {CurrencyDropDown} from "../../component/currency-dropdown/CurrencyDropDown";
import {FetchSupportCurrenciesCmd} from "../../command/FetchSupportCurrenciesCmd";
import {ChangeEvent, useState} from "react";
import {launch} from "../../core/HookExt";
import {CompareCurrencyRateCmd} from "../../command/CompareCurrencyRateCmd";

export interface ICompareItem {
    orgName: string
    orgImage: string
    exchangeRate: string
    transferFee: string
    totalPayment: string
    loss: string
    isOHN: boolean
}

export interface IComparison {
    homeCurrency: string;
    invoiceCurrency: string;
    exchangeRate: string;
    lastTime: string;

    items?: ICompareItem[]
}

export default function RateComparisonPage() {
    const initPaired = {home: null, invoice: null, amount: "0"}
    let [paired, setPaired] = useState(initPaired)
    let supportCurrencies = useService(FetchSupportCurrenciesCmd).flow.asState()
    let comparisonCmd = useService(CompareCurrencyRateCmd)
    let comparison = comparisonCmd.flow.asState()
    let loading = comparisonCmd.loading.asState()

    let onHomeCurrencyClick = (item) => {
        setPaired({...paired, home: item})
    }
    let onInvoiceCurrencyClick = (item) => {
        setPaired({...paired, invoice: item})
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
    launch(() => comparisonCmd.invoke(paired))

    return <div className={"rate-comparison"}>
        <div className={"compare-filter"}>
            <label>Invoice Currency</label>
            <CurrencyDropDown items={supportCurrencies.invoice}
                              onItemClick={onInvoiceCurrencyClick}
                              selected={paired.invoice}/>

            <label>Amount</label>
            <input type={"text"}
                   placeholder={"Enter Amount"}
                   inputMode={"numeric"}
                   value={paired.amount}
                   onChange={onAmountChange}/>

            <label>Home currency</label>
            <CurrencyDropDown items={supportCurrencies.home}
                              onItemClick={onHomeCurrencyClick}
                              selected={paired.home}/>

            <label>Interbank exchange rate</label>
            <div className={"compare-fx"}>
                {
                    comparison != null ? <>
                        <h3>1 {comparison.homeCurrency} = {comparison.exchangeRate} {comparison.invoiceCurrency}</h3>
                        <span>{comparison.lastTime}</span>
                    </> : <>
                        <h3>-</h3>
                        <span>-</span>
                    </>
                }

            </div>
            <div className={"compare-action"}>
                <button onClick={onClearClick}>Clear</button>
                <button disabled={loading} onClick={onCompareClick}>
                    Compare {
                    loading ?
                        <i className={"fa fa-refresh fa-spin"} style={{width: 16, height: 16}}/>
                        : <AppIcon src={"ic_compare.svg"} width={16} height={16}/>
                }
                </button>
            </div>
        </div>
        <div className={"divider-horizontal"}/>
        <div className={"compare-content"}>
            {
                comparison?.items == null ?
                    <span>Please select Invoice Currency, Amount, Home Currency and click Compare to generate comparison</span>
                    : <table style={{alignSelf: "self-start"}}>
                        <thead>
                        <tr>
                            <th/>
                            <th>Exchange rate</th>
                            <th>Transfer fee</th>
                            <th>Total payment</th>
                            <th>Loss</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comparison.items.map((it, index) => <tr key={index}>
                            <td>
                                {it.isOHN ?
                                    <AppIcon src={"ic_onehypernet.svg"} height={40} width={150}/> :
                                    <img src={it.orgImage} alt={it.orgName} height={40} width={100}/>
                                }
                            </td>
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