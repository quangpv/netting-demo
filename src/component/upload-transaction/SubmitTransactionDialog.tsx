import {Modal} from "@mui/material";
import "./submit-tran-dialog.css"
import AppIcon from "../AppIcon";
import {useService} from "../../core/Injection";
import {ITransactionFile} from "../../model/ui/Models";
import {useEffect} from "react";
import {SubmitTransactionCmd} from "../../command/SubmitTransactionCmd";

interface Props {
    isShow: boolean
    onClose: () => void
    file: ITransactionFile | null
    nettingId: string
}

export default function SubmitTransactionDialog(props: Props) {
    let cmd = useService(SubmitTransactionCmd)
    let progress = cmd.flow.asState()
    let onClose = () => {
        cmd.reset()
        props.onClose()
    }
    useEffect(() => {
        if (props.isShow) cmd.invoke(props.file, props.nettingId)
    }, [cmd, props.file, props.isShow])
    let ProgressIndicator = (index: number) => {
        if (index <= progress) {
            return <div className={"indicator-verified"}>{<AppIcon src={"ic_check.svg"}/>}</div>
        }
        if (index === progress + 1) {
            return <div className={"indicator-active"}>{index}</div>
        }
        return <div>{index}</div>
    }

    let ProgressLine = (index: number) => {
        if (index <= progress) {
            return <div className={`line line-active`}/>
        }
        return <div className={`line`}/>
    }
    let ProgressName = (index: number, progressName: string) => {
        if (index <= progress) {
            return <label><AppIcon src={"ic_check_green.svg"} width={14} height={14}/> {progressName}</label>
        }
        if (index === progress + 1) {
            return <label style={{color: "var(--colorGreen)"}}><b>{index}</b> {progressName}</label>
        }
        return <label><b>{index}</b> {progressName}</label>
    }
    return <Modal
        className={"modal-box"}
        open={props.isShow}
        onClose={onClose}
    >
        <div className={"modal-box-container submit-tran"}>
            <div className={"indicator-section"}>
                {ProgressIndicator(1)}
                {ProgressLine(1)}
                {ProgressIndicator(2)}
                {ProgressLine(2)}
                {ProgressIndicator(3)}
            </div>

            {ProgressName(1, "Aggregating transactions from other users…")}
            {ProgressName(2, "Validating transactions")}
            {ProgressName(3, "Netting in progress")}

            {progress !== 3 ? <p>Please do not close the browser.</p>
                : <p>Successfully.</p>}
        </div>
    </Modal>

}