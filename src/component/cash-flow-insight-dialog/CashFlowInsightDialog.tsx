import {Modal} from "@mui/material";
import "./insight.css"
import AppIcon from "../AppIcon";
import React, {useState} from "react";

interface Props {
    isShow: boolean
    onClose: () => void
    onPayClick: (e) => void
}

export default function CashFlowInsightDialog(props: Props) {
    let [copied, setCopied] = useState(-1)

    let onClose = () => {
        props.onClose()
    }
    let onCopyToClipBoard = async (e: React.MouseEvent<HTMLButtonElement>, index: number, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopied(index)
    }
    let CopyableLabel = (index: number) => {
        return <div className={"copyable-label"}>
            <label>OKAIAEA1XXX</label>
            <button
                className={"tooltip"}
                onClick={(e) => onCopyToClipBoard(e, index, "OKAIAEA1XXX")}>
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
                {CopyableLabel(1)}
                <h6>IBAN</h6>
                {CopyableLabel(2)}
                <h6>Amount (EUR)</h6>
                {CopyableLabel(3)}
                <h6>Description</h6>
                {CopyableLabel(4)}
            </div>
            <div className={"detail"}>
                <h6>Other details (if needed)</h6>
                <label>Payee Name</label>
                <p>OneHypernet Europe SA</p>
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