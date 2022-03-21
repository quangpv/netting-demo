import CashFlowCard from "../../../component/cash-flow/CashFlowCard";
import CashChartCard from "../../../component/chart-card/CashChartCard";
import "./netting-cycles.css"
import NettingCycleTable from "../../../component/netting-table/NettingCycleTable";
import {useService} from "../../../core/Injection";
import {FetchNettingListCmd} from "../../../command/FetchNettingListCmd";
import FetchNettingOverviewCmd from "../../../command/FetchNettingOverviewCmd";


export default function NettingCyclesPage() {
    let fetchNettingListCmd = useService(FetchNettingListCmd)
    let fetchOverviewCmd = useService(FetchNettingOverviewCmd)

    let cycles = fetchNettingListCmd.flow.asState()
    let overview = fetchOverviewCmd.flow.asState()

    return (<div className={"netting-cycle-container"}>
        <label>OVERVIEW: {overview.month}</label>
        <div className={"netting-cash-info"}>
            <CashFlowCard item={overview.cashFlow}/>
            <CashChartCard item={overview.feeSaved} name={"Fee saved"}/>
            <CashChartCard item={overview.cashSaved}
                           icon={"ic_filter.svg"}
                           name={"Cashflow saved"}
                           lineColor={"#1E88E5"}
                           indicatorColor={"#D2E7FA"}
                           filledColorStart={"#78B8EF"}
                           filledColorEnd={"#eaf1fd"}
            />
        </div>
        <label>NETTING CYCLES</label>
        <NettingCycleTable items={cycles}/>
    </div>)
}