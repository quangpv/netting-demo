export interface ITransaction {
    id: string
    date: string
    due: string
    type: string
    counterParty: string
    currency: string
    amount: string
}

interface Props {
    items: ITransaction[]
}

export default function UploadedSection(props: Props) {
    return <div className={"uploaded-section"}>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Due</th>
                <th>Transaction Id</th>
                <th>Type</th>
                <th>Counter Party</th>
                <th>Currency</th>
                <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items.map((it, index) => {
                    return <tr key={index}>
                        <td>{it.date}</td>
                        <td>{it.due}</td>
                        <td>{it.id}</td>
                        <td>{it.type}</td>
                        <td>{it.counterParty}</td>
                        <td>{it.currency}</td>
                        <td>{it.amount}</td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}