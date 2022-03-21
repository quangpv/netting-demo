import {INettingReport, isCashReport} from "../../model/ui/Models";
import AppIcon from "../AppIcon";
import "./netting-report.css"

interface Props {
    reports?: INettingReport[] | null
    onInsightClick?: () => void | null
}

export default function NettingReportSection(props?: Props) {
    let reports = props.reports
    if (reports == null || reports.length === 0) return <div/>
    return <div className={"netting-report"}>
        <table>
            <thead>
            <tr>
                <th/>
                <th>Before</th>
                <th>After</th>
            </tr>
            </thead>
            <tbody>
            {
                reports?.map((it, index) => {
                    if (isCashReport(it)) {
                        return <tr key={index}>
                            <td>{it.reportName}</td>
                            <td><span className={"currency"}>{it.currency}</span> {it.before}</td>
                            <td><span className={"currency"}>{it.currency}</span> {it.after}</td>
                        </tr>
                    }
                    return <tr key={index}>
                        <td>{it.reportName}</td>
                        <td>{it.before}</td>
                        <td>{it.after}</td>
                    </tr>
                })
            }
            </tbody>
        </table>

        <button onClick={props?.onInsightClick}>Cashflow Insights <AppIcon src={"ic_insight.svg"}/></button>
    </div>
}