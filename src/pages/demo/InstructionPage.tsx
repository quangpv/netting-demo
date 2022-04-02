import {useNavigate} from "react-router-dom";
import {Routing} from "../../app/Routing";

export default function InstructionPage() {
    const navigate = useNavigate()
    const onNewCycleClick = () => {
        navigate({pathname: Routing.createNetting})
    }
    return <div className={"instruction-page"}>
        <h1>How to use this demo</h1>
        <ul>
            <li>
                Click on the “New cycle” button below to create a new netting cycle in the <b>“Overview”</b> tab
                with an
                “Open” status.
            </li>
            <li>
                At the <b>“Overview”</b> tab, click on “View” to select the newly created netting cycle.
            </li>
            <li>
                Upload your excel file of transactions to this netting cycle (please use mock data).
                <p className={"style-circle"}>
                    Upload a minimum of 10 transactions, 2 counterparties, and 2 currencies.
                </p>
            </li>
            <li>
                Counterparty transactions are automatically created and randomised for demo purposes. The
                estimated savings will be shown immediately.
            </li>
            <li>
                Payment instructions will be generated. Click on “I have made/received payment” to complete the
                netting demo.
            </li>
        </ul>
        <button onClick={onNewCycleClick}>New cycle</button>
    </div>
}