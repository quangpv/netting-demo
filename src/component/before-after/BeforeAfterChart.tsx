import "./before-after.css"
import {ICashSaving} from "../../model/ui/Models";

interface Props {
    cashSaving: ICashSaving
}

export default function BeforeAfterChart(props?: Props | null) {
    let cashSaving: ICashSaving = props?.cashSaving || {
        beforeAmount: "0",
        afterAmount: "0",
        savingAmount: "0",
        savingPercent: "0%",
        afterPercent: "100%"
    }

    let showSavingStyle = cashSaving.savingPercent === "0%" ? "none" : "block"
    return <div className={"before-after-chart"}>
        <div className={"before-chart"}>
            <span>{cashSaving.beforeAmount}</span>
        </div>
        <div className={"after-chart"}>
            <div style={{height: cashSaving.savingPercent,  display: showSavingStyle}}>
                <p className={"bold"}>{cashSaving.savingPercent} savings</p>
                <p>{cashSaving.savingAmount}</p>
            </div>
            <span style={{height: cashSaving.afterPercent}}>{cashSaving.afterAmount}</span>
        </div>
        <label>Before</label>
        <label>After</label>
    </div>
}