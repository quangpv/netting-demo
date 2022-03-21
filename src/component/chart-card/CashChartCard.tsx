import "./chart-card.css"
import AppIcon from "../AppIcon";
import {ICashSaved} from "../../model/ui/INettingOverview";
import ChartView from "./ChartView";

export default function CashChartCard(props: {
    item: ICashSaved,
    icon?: string,
    name: string,
    lineColor?: string
    indicatorColor?: string
    filledColorStart?: string
    filledColorEnd?: string
}) {
    let item = props.item
    return <div className={"chart-card-container ohn-card"}>
        <div className={"chart-card"}>
            <div>
                <AppIcon src={props.icon || "ic_cash.svg"}/>
                <span>{props.name}</span>
            </div>
            <div>
                <span>{item.currency}</span>
                <span>{item.amountThisMonth}</span>
            </div>
            <div>
                <span>{item.currency}</span>
                <span>{item.amountYTD}</span>
                <span>saved YTD</span>
            </div>
        </div>

        <ChartView
            items={item.savedList}
            lineColor={props.lineColor}
            indicatorColor={props.indicatorColor}
            filledColorStart={props.filledColorStart}
            filledColorEnd={props.filledColorEnd}
        />
    </div>
}