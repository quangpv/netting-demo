import {Modal} from "@mui/material";
import "./cash-insight.css"
import CashInsightChart, {IInsight} from "./CashInsightChart";

interface Props {
    isShow: boolean
    onClose: () => void
    before: IInsight[]
    after: IInsight[]
}

export default function CashInsightDialog(props: Props) {
    let after: IInsight = props.after.length > 0 ? props.after[0] : {
        month: "Not available",
        cashFlows: ["Not available"]
    }
    return <Modal
        className={"modal-box"}
        open={props.isShow}
        onClose={props.onClose}
    >
        <div className={"modal-box-container cash-insight-dialog"}>
            <h3>Cashflow insights</h3>
            <div className={"chart-container"}>
                <div className={"insight-before"}>
                    <label>Before</label>
                    <CashInsightChart items={props.before}/>
                </div>
                <div className={"insight-after"}>
                    <label>After</label>
                    <b>{after.month}</b>
                    <div className={"insight-circle"}/>
                    <b>{after.cashFlows[0]}</b>
                </div>
            </div>
        </div>
    </Modal>
}