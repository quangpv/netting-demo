import "./rate-comparison.css"
import AppIcon from "../../component/AppIcon";

export default function RateComparisonPage() {
    return <div className={"rate-comparison"}>
        <div className={"compare-filter"}>
            <label>Invoice Currency</label>
            <label>Amount</label>
            <label>Home currency</label>
            <label>Interbank exchange rate</label>
            <div className={"select"}>
                <span>Select</span>
                <AppIcon src={"ic_dropdown.svg"} width={18} height={18}/>
            </div>
            <input type={"text"} placeholder={"Enter Amount"}/>

            <div className={"select"}>
                <span>Select</span>
                <AppIcon src={"ic_dropdown.svg"} width={18} height={18}/>
            </div>
            <div className={"compare-fx"}>
                <h3>1 EUR = 1.53758 SGD</h3>
                <span>2 minutes ago</span>
            </div>
            <div className={"compare-action"}>
                <button>Clear</button>
                <button>Compare <AppIcon src={"ic_compare.svg"}/></button>
            </div>
        </div>
        <div className={"divider-horizontal"}/>
        <div className={"compare-content"}>
            <span>Please select Invoice Currency, Amount, Home Currency and click Compare to generate comparison</span>
        </div>
    </div>
}