import "./netting-desc.css"
import AppIcon from "../AppIcon";
import {NettingStatus} from "../../model/enumerate/NettingStatus";
import React from "react";
import {INettingDesc} from "../../model/ui/INettingInfo";

interface Props {
    desc: INettingDesc
    status: NettingStatus
    onShowUploadDialog: (e) => void
    onPaymentClick: (e) => void
}

interface FileProps {
    name: string
    size: string
    icon: string
}

export default function NettingDescSection(props: Props) {
    let desc = props.desc

    let ReadyToSettlementState = () => {
        return <div>
            <label>Settlement: <span>{desc.nettingName}</span></label>
            <h1>{desc.date}</h1>
            <h6>1 <span>day</span> 1 <span>hours</span> 1 <span>minutes</span></h6>
        </div>
    }

    let SettlementState = () => {
        return <div>
            <label><b>Settlement: </b>{desc.nettingName}</label>
            <h1 style={{color: "black"}}>Net Payable: {desc.payableAmount}</h1>
        </div>
    }

    let UploadExcelFileState = () => {
        return <div>
            <p>
                Upload your Excel file to calculate the Receviables, Payables,
                Net Cashflow, and Estimated Savings
            </p>

            <button onClick={props.onShowUploadDialog}>
                Upload Excel File for Netting
                <AppIcon src={"ic_upload_file.svg"} width={16} height={16}/>
            </button>
        </div>
    }

    let PaymentState = () => {
        return <div>
            <p>Please make payment by 8th April 2022 (Friday) 11:59 PM to settle all transactions in this netting
                cycle.</p>
            <button onClick={props?.onPaymentClick}>
                Payment
                <AppIcon src={"ic_forwarding.svg"} width={16} height={16}/>
            </button>
        </div>
    }

    let FileWidget = (props: FileProps) => {
        return <div className={"file-widget"}>
            <AppIcon src={props.icon}/>
            <span>{props.name}</span>
            <span>{props.size}</span>
        </div>
    }

    let UploadedAndReportFileState = () => {
        return <div>
            <label>Excel file used for netting</label>
            <label>Netting report</label>
            <FileWidget
                icon={"ic_file_excel.svg"}
                name={desc.uploadedFile?.name || "empty"}
                size={desc.uploadedFile?.size || "0b"}
            />
            <FileWidget
                icon={"ic_file_pdf.svg"}
                name={desc.reportFile?.name || "empty"}
                size={desc.reportFile?.size || "0b"}
            />
        </div>
    }

    let EmptyState = () => <div/>

    if (props.status <= NettingStatus.Open) return <div className={"netting-desc"}>
        <ReadyToSettlementState/>
        {props.status === NettingStatus.None ? <div/> : <UploadExcelFileState/>}
        <EmptyState/>
    </div>

    return <div className={"netting-desc"}>
        <SettlementState/>
        {props.status !== NettingStatus.Settled ? <PaymentState/> : <div/>}
        <UploadedAndReportFileState/>
    </div>
}