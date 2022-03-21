import AppIcon from "../AppIcon";
import "./payment-card.css"

export interface IPaymentCard {
    currency: string,
    amount: string
    transactionCount: string
    partner: string
}

interface Props {
    icon: string
    color: string
    type: string
    info: IPaymentCard
}

export default function PaymentCard(props: Props) {
    let info = props.info
    return <div className={"payment-card ohn-card"}>
        <div>
            <AppIcon src={props.icon}/>
            <span style={{
                color: `var(${props.color})`,
                marginLeft: "var(--size-5)",
                fontSize: "var(--fontSize-14)"
            }}>{props.type}</span>
        </div>
        <div>
            <span>{info.currency}</span>
            <span style={{
                fontWeight: "bold",
                fontSize: "var(--fontSize-22)",
                marginLeft: "var(--size-5)",
                color: `var(${props.color})`
            }}>{info.amount}</span>
        </div>
        <div>
            <div>
                <span className={"count"}>{info.transactionCount}</span>
                <span style={{marginLeft: "var(--size-5)"}}>transactions</span>
            </div>
            <div>
                <span className={"count"}>{info.partner}</span>
                <span style={{marginLeft: "var(--size-5)"}}>partners</span>
            </div>
        </div>
    </div>
}