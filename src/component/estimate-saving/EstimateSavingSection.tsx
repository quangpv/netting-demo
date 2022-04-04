import BeforeAfterChart from "../before-after/BeforeAfterChart";
import {IEstimatedSaving} from "../../model/ui/Models";
import "./estimate-saving.css"
import CircularProgressBar from "../circular-progress/CircularProgressBar";

interface Props {
    item?: IEstimatedSaving | null
}

export default function EstimateSavingSection(props: Props) {
    let item = props.item
    return <div className={"estimate-saving"}>
        <label>Fees</label>
        <BeforeAfterChart cashSaving={item?.fee}/>

        <label>Cash Outflow</label>
        <BeforeAfterChart cashSaving={item?.cashFlow}/>

        <label>Potential</label>
        <div className={"potential-chart"}>
            <CircularProgressBar
                percent={item?.potentialPercent || "0%"}/>
            <p>
                Estimated savings potential achieved.
                The more transactions and counterparties settled via OneHypernet, the higher the level
                of
                savings.
            </p>
        </div>
    </div>
}