import "./netting-table.css"
import * as React from 'react';
import {Routing} from "../../app/Routing";
import {Link} from "react-router-dom";
import NettingStatusWidget from "../netting-status/NettingStatusWidget";
import {INettingCycle} from "../../model/ui/Models";

interface NettingCycleProps {
    items: INettingCycle[]
    onViewItemClick?: (INettingCycle) => void
}

export default function NettingCycleTable(props: NettingCycleProps) {
    let values = props.items
    return <div className={"netting-table"}>
        <table>
            <thead>
            <tr>
                <th colSpan={6}/>
                <th colSpan={3}>Netted</th>
                <th colSpan={2}>Savings</th>
                <th colSpan={1}/>
            </tr>
            <tr>
                <th>Date</th>
                <th>Settlement</th>
                <th>Netting Id</th>
                <th>Status</th>
                <th>Netting Group</th>
                <th>NetCashFlow</th>

                <th>Transactions</th>
                <th>Receivable</th>
                <th>Payable</th>

                <th>Fees</th>
                <th>Cashflow</th>
                <th/>
            </tr>
            </thead>
            <tbody>
            {
                values.map((item, index) => {
                    return <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.settlement}</td>
                        <td>{item.nettingId}</td>
                        <td>
                            <NettingStatusWidget status={item.status}/>
                        </td>
                        <td>{item.group}</td>
                        <td style={{
                            color: item.netCashFlow.isIncrease ? "var(--colorGreen)" : "var(--colorBlack)"
                        }}>
                            <span>{item.netCashFlow.currency}</span>
                            <span style={{fontWeight: "bold"}}>
                                {item.netCashFlow.isIncrease == null ? "" :
                                    item.netCashFlow.isIncrease ? " +" : " -"}{item.netCashFlow.amount}
                            </span>
                        </td>
                        <td>{item.nettedTranCount}</td>
                        <td><span>{item.receivable.currency}</span> {item.receivable.amount}</td>
                        <td><span>{item.payable.currency}</span> {item.payable.amount}</td>
                        <td><span>{item.fee.currency}</span> {item.fee.amount}</td>
                        <td><span>{item.cashFlow.currency}</span> {item.cashFlow.amount}</td>
                        <td><Link to={Routing.detailOf(item.nettingId)}>View</Link></td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </div>
}
