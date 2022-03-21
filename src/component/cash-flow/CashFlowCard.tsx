import "./cash-flow.css"
import {ICashFlow} from "../../model/ui/INettingOverview";


export default function CashFlowCard(props: { item: ICashFlow }) {
    let cashFlow = props.item
    return (<div className={"cash-flow ohn-card"}>
        <span style={{gridArea: "1/1"}}>Receivable ({cashFlow.currency})</span>

        <div className={"cash-progress"} style={{gridArea: "1/2"}}>
            <div style={{
                backgroundColor: "var(--colorGreen_20)",
                width: cashFlow.receivePercent,
            }}/>
        </div>

        <span style={{
            gridArea: "1/3",
            color: "var(--colorGreen)",
            fontWeight: "bold"
        }}>{cashFlow.receiveAmount}</span>

        <span style={{gridArea: "2/1"}}>Payable ({cashFlow.currency})</span>
        <div className={"cash-progress"} style={{gridArea: "2/2"}}>
            <div style={{
                backgroundColor: "var(--colorRed_20)",
                width: cashFlow.payPercent,
            }}/>
        </div>

        <span style={{
            gridArea: "2/3",
            color: "var(--colorRed)",
            fontWeight: "bold"
        }}>{cashFlow.payAmount}</span>

        <span style={{gridArea: "3/1",}}>Net cashflow ({cashFlow.currency})</span>
        <div className={"cash-progress"} style={{gridArea: "3/2", position: "relative"}}>
            <div style={{
                backgroundColor: "var(--colorGray_20)",
                width: "100%",
            }}/>
            <div style={{
                backgroundColor: "white",
                width: cashFlow.flowPercent,
                position: "absolute"
            }}/>
        </div>
        <span style={{
            gridArea: "3/3",
            color: "var(--colorBlack)",
            fontWeight: "bold"
        }}>{cashFlow.flowAmount}</span>

        <div className={"cash-vertical-line"} style={{marginLeft: cashFlow.flowPercent}}/>
    </div>)
}