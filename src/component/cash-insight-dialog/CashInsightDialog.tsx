import {Modal} from "@mui/material";
import "./cash-insight.css"
import CashInsightChart, {IInsight} from "./CashInsightChart";

interface Props {
    isShow: boolean
    onClose: () => void
    items: IInsight[]
}

export default function CashInsightDialog(props: Props) {

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
                    <CashInsightChart items={props.items}/>
                </div>
                <div className={"insight-after"}>
                    <label>After</label>
                    <b>5 Mar</b>
                    <div className={"insight-circle"}/>
                    <b>- EUR 7,000.0</b>
                </div>
            </div>
        </div>
    </Modal>
}