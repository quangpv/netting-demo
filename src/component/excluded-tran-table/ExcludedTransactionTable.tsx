import {IExcludedTransaction} from "../../model/ui/Models";
import "../../style/table-section.css"

interface Props {
    items?: IExcludedTransaction[] | null
}

export default function ExcludedTransactionTable(props: Props) {
    if (props.items == null || props.items.length === 0) return <div/>
    return <div className={"table-section"}>
        <label>EXCLUDED TRANSACTIONS</label>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Due</th>
                <th>Transaction Id</th>
                <th>Type</th>
                <th>CounterParty</th>
                <th>Bill Amount</th>
                <th>Reason</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items.map((it, index) => {
                    return <tr key={index}>
                        <td>{it.date}</td>
                        <td>{it.due}</td>
                        <td>{it.tranId}</td>
                        <td>{it.tranType}</td>
                        <td>{it.counterParty}</td>
                        <td>{it.billAmount}</td>
                        <td>{it.reason}</td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}