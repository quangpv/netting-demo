import {INettedTransaction} from "../../model/ui/Models";
import "../../style/table-section.css"

interface Props {
    items?: INettedTransaction[] | null
}

export default function NettedTable(props?: Props) {
    if (props?.items == null || props.items.length === 0) return <div/>
    return <div className={"table-section"}>
        <label>NETTED TRANSACTIONS</label>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Due</th>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Counter Party</th>
                <th>Bill Amount</th>
                <th>Local Amount</th>
                <th>Fee Saved</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items?.map((it, index) => {
                    return <tr key={index}>
                        <td>{it.date}</td>
                        <td>{it.due}</td>
                        <td>{it.tranId}</td>
                        <td>{it.tranType}</td>
                        <td>{it.counterParty}</td>
                        <td><span className={"currency"}>{it.billCurrency}</span> {it.billAmount}</td>
                        <td><span className={"currency"}>{it.localCurrency}</span> {it.localAmount}</td>
                        <td><span className={"currency"}>{it.localCurrency}</span> {it.feeSaved}</td>
                    </tr>
                })
            }
            </tbody>
        </table>

    </div>
}