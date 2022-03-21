import "./netting-status.css"
import {NettingStatus} from "../../model/enumerate/NettingStatus";

interface Props {
    status: NettingStatus
}

const statuses = [
    {
        id: NettingStatus.Open,
        type: "Open",
        borderColor: "var(--colorPrimary)",
        backgroundColor: "var(--colorPrimary_20)"
    },
    {
        id: NettingStatus.Processing,
        type: "Processing",
        borderColor: "var(--colorYellow)",
        backgroundColor: "var(--colorYellow_20)"
    },
    {
        id: NettingStatus.Settled,
        type: "Settled",
        borderColor: "var(--colorGreen)",
        backgroundColor: "var(--colorGreen_20)"
    },
]
export default function NettingStatusWidget(props: Props) {
    let status = statuses.find(it => it.id === props.status) || {
        id: NettingStatus.None,
        type: "None",
        borderColor: "var(--colorPrimary)",
        backgroundColor: "var(--colorPrimary_20)"
    }
    return <span className={"netting-status"} style={{
        color: status.borderColor,
        borderColor: status.borderColor,
        backgroundColor: status.backgroundColor,
    }}>{status.type}</span>
}