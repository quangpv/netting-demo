import {Modal} from "@mui/material";
import AppIcon from "../AppIcon";
import "./upload-transaction.css"
import {useState} from "react";
import UploadSection from "./UploadSection";
import UploadedSection from "./UploadedSection";
import {ITransactionFile} from "../../model/ui/Models";

interface Props {
    isShow: boolean
    onClose: () => void
    onSubmit: (file: ITransactionFile) => void
}

export default function UploadTransactionDialog(props: Props) {
    let [state, setState] = useState({
        step: 0,
        file: null
    })
    let onContinue = () => {
        if (state.step === 0) {
            setState({...state, step: 1})
        } else {
            setState({...state, step: 0, file: null})
            props.onSubmit(state.file as ITransactionFile)
        }
    }
    let onClose = () => {
        setState({...state, step: 0, file: null})
        props.onClose()
    }
    let onFileChange = (file: ITransactionFile) => {
        setState({...state, file: file})
    }
    return (
        <Modal
            className={"modal-box"}
            open={props.isShow}
            onClose={onClose}
        >
            <div className={"modal-box-container upload-trans"}>
                <label>Upload Excel File for Netting</label>
                {
                    state.step === 0 && <UploadSection onFileChange={onFileChange}/>
                }
                {
                    state.step === 1 && <UploadedSection items={state.file.transactions}/>
                }

                <div className={"divider-horizontal"}/>
                <div className={"group-button"}>
                    <button onClick={onClose}>Cancel</button>
                    <button className={"btn-continue"} disabled={state.file == null}
                            onClick={onContinue}>Continue <AppIcon
                        src={"ic_forwarding.svg"}/></button>
                </div>
            </div>
        </Modal>
    )
}