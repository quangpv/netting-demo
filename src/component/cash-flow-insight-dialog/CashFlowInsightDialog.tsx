import {Modal} from "@mui/material";
import "./insight.css"
import AppIcon from "../AppIcon";
import React, {useState} from "react";
import copyToClipboard from 'copy-to-clipboard';
import {useService} from "../../core/Injection";
import {flowOf} from "../../core/Flow";

interface Props {
    isShow: boolean
    onClose: () => void
    onPayClick: (e) => void
    amount: string
}

export default function CashFlowInsightDialog(props: Props) {
    let [copied, setCopied] = useState(-1)
    let paymentInfoCmd = useService(FetchPaymentInfoCmd)
    let paymentInfo = paymentInfoCmd.flow.asState()

    let onClose = () => {
        props.onClose()
    }
    let onCopyToClipBoard = async (e: React.MouseEvent<HTMLButtonElement>, index: number, value: string) => {
        copyToClipboard(value)
        setCopied(index)
    }
    let CopyableLabel = (index: number, value: string) => {
        return <div className={"copyable-label"}>
            <label>{value}</label>
            <button
                className={"tooltip"}
                onClick={(e) => onCopyToClipBoard(e, index, value)}>
                Click to Copy
                <span className="tooltip-text" id="myTooltip">
                    {copied === index ? "Copied" : "Copy to clipboard"}
                </span>
            </button>
        </div>
    }
    return <Modal
        className={"modal-box"}
        open={props.isShow}
        onClose={onClose}
    >
        <div className={"modal-box-container insight"}>
            <div className={"info"}>
                <h6>BIC/SWIFT</h6>
                {CopyableLabel(1, paymentInfo.swift)}
                <h6>IBAN</h6>
                {CopyableLabel(2, paymentInfo.iban)}
                <h6>Amount (EUR)</h6>
                {CopyableLabel(3, props.amount)}
                <h6>Description</h6>
                {CopyableLabel(4, paymentInfo.desc)}
            </div>
            <div className={"detail"}>
                <h6>Other details (if needed)</h6>
                <label>Payee Name</label>
                <p>{paymentInfo.payeeName}</p>
                <label>Bank Address</label>
                <p>
                    OneHypernet Europe SA
                    Avenue Angles 53
                    Suite 85
                    1010 Brussels
                    Belgium
                </p>
            </div>
            <div className={"action"}>
                <div>
                    <button onClick={props.onClose}>Close</button>
                </div>
                <button onClick={props.onPayClick}>I have made payment <AppIcon src={"ic_check.svg"}/></button>
            </div>
        </div>
    </Modal>
}

export interface IPaymentInfo {
    payeeName: string;
    desc: string;
    iban: string;
    swift: string;
}

export class FetchPaymentInfoCmd {
    private readonly initial: IPaymentInfo = {
        desc: "JREWR23423",
        iban: "JKSDNXBM2734",
        payeeName: "OneHypernet Europe SA",
        swift: "NZMDF2232"
    }
    flow = flowOf<IPaymentInfo>(this.initial)
}