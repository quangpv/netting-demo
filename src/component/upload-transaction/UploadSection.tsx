import AppIcon from "../AppIcon";
import {LinearProgress} from "@mui/material";
import React, {useState} from "react";
import {useService} from "../../core/Injection";
import {launch} from "../../core/HookExt";
import {ReadFileCmd} from "../../command/ReadFileCmd";
import {ITransactionFile} from "../../model/ui/Models";

interface Props {
    onFileChange?: (file: ITransactionFile | null) => void | undefined
}

export default function UploadSection(props: Props) {
    let [dragging, setDragging] = useState(false)
    let readFileCmd = useService(ReadFileCmd)
    let loading = readFileCmd.loading.asState()
    let file = readFileCmd.flow.asState()

    launch(() => readFileCmd.flow.collect(it => {
        props.onFileChange(it)
    }))

    let onDragDropClick = (e: React.DragEvent<HTMLDivElement>) => {
        let input = e.currentTarget.lastChild as HTMLInputElement
        input.value = ""
        input.click()
    }
    let onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setDragging(true)
    }
    let onDragExit = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setDragging(false)
    }
    let onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        readFileCmd.invoke(dt.files[0])
        setDragging(false)
    }
    let onRemoveFileClick = (e: React.MouseEvent<HTMLInputElement>) => {
        e.preventDefault();
        let input = e.currentTarget.lastChild as HTMLInputElement
        input.value = ""
        readFileCmd.invoke(null)
        setDragging(false)
    }
    let onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let firstFile = e.currentTarget.files[0]
        setDragging(false)
        readFileCmd.invoke(firstFile)
    }

    return <div className={"upload-section"}>
        <div className={`drag-drop ${dragging ? "drag-enter" : ""}`}
             onDragOver={onDragEnter}
             onDragLeave={onDragExit}
             onDrop={onDrop}
             onClick={onDragDropClick}
        >
            <span>Drag and drop to upload or</span>
            <label>Browse <AppIcon src={"ic_upload_excel.svg"}/></label>
            <input type="file" hidden onChange={onFileChange} accept=".csv"/>
        </div>

        {
            loading.isLoading && <div>
                <label>Uploading <b>{loading.fileName}</b> </label>
                <LinearProgress className={"progress"} variant={"indeterminate"}/>
            </div>
        }

        {
            (file != null) && <div className={"file-uploaded"} onClick={onRemoveFileClick}>
                <AppIcon src={"ic_file_excel.svg"}/>
                <label>{file.name}</label>
                <label>{file.size}</label>
                <AppIcon className={"btn-delete"} src={"ic_delete_forever.svg"}/>
            </div>
        }
    </div>
}