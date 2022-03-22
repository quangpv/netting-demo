import "./exchange-rate-container.css"
import ic_check from "../../icons/ic_check.svg"
import ic_export from "../../icons/ic_export.svg"
import {useService} from "../../core/Injection";
import {launch} from "../../core/HookExt";
import {FetchNettingParamsCmd} from "../../command/FetchNettingParamsCmd";
import {CSVLink} from "react-csv"
import {ChangeEvent, useState} from "react";

export interface FilterParams {
    from: string
    to: string
    location: string
    destination: string
}

const filterDef: FilterParams = {
    from: "",
    to: "",
    location: "",
    destination: ""
}

export default function ExchangeRatePage() {
    let [filter, setFilter] = useState<FilterParams>(filterDef)
    let cmd = useService(FetchNettingParamsCmd)
    let state = cmd.flow.asState()

    let onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let newFilter = {...filter}
        newFilter[e.target.name] = e.target.value
        setFilter(newFilter)
    }

    let onClearClick = (e) => {
        setFilter(filterDef)
        cmd.invoke(filterDef)
    }
    let onFilterClick = (e) => {
        cmd.invoke(filter)
    }

    launch(() => cmd.invoke(filter))

    return <div className={"exchange-rate-container"}>
        <div className={"exchange-rate-filter"}>
            <label style={{gridArea: "1/1"}}>From</label>

            <input style={{gridArea: "2/1"}}
                   placeholder={"From"}
                   name={"from"}
                   value={filter.from}
                   onChange={onInputChange}/>

            <label style={{gridArea: "1/2"}}>To</label>
            <input style={{gridArea: "2/2"}}
                   placeholder={"To"}
                   name={"to"}
                   value={filter.to}
                   onChange={onInputChange}/>

            <label style={{gridArea: "1/3"}}>Location</label>
            <input style={{gridArea: "2/3"}}
                   placeholder={"Location"}
                   name={"location"}
                   value={filter.location}
                   onChange={onInputChange}/>


            <label style={{gridArea: "1/4"}}>Destination</label>
            <input style={{gridArea: "2/4"}}
                   placeholder={"Destination"}
                   name={"destination"}
                   value={filter.destination}
                   onChange={onInputChange}/>

            <label style={{gridArea: "1/5/1/span 2"}}/>
            <button style={{gridArea: "2/5"}} className={"btn-clear"} onClick={onClearClick}>Clear</button>
            <div style={{gridArea: "2/6"}} className={"btn-apply-filter ohn-btn"} onClick={onFilterClick}>
                <span>Apply filter</span>
                <img src={ic_check} width={18} height={18} alt={""}/>
            </div>
        </div>
        <div className={"divider-horizontal"}/>

        <div className={"exchange-rate-table"}>
            <div className={"exchange-rate-export"}>
                <label>Exchange Rates</label>
                <div className={"ohn-btn"}>
                    <CSVLink
                        data={state}
                        filename={"netting-params.csv"}
                    >Export CSV</CSVLink>
                    <img src={ic_export} width={16} height={16} alt={""}/>
                </div>
            </div>
            <div className={"divider-horizontal"}/>
            <table>
                <thead>
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Margin(%)</th>
                    <th>Fee(%)</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Fixed</th>
                    <th>FX</th>
                    <th>Location</th>
                    <th>Destination</th>
                </tr>
                </thead>
                <tbody>
                {
                    state.map((item, index) => {
                        return <tr key={index}>
                            <td>{item.from}</td>
                            <td>{item.to}</td>
                            <td>{item.margin}</td>
                            <td>{item.fee}</td>
                            <td>{item.min}</td>
                            <td>{item.max}</td>
                            <td>{item.fixed}</td>
                            <td>{item.fx}</td>
                            <td>{item.location}</td>
                            <td>{item.destination}</td>
                        </tr>
                    })
                }
                </tbody>
            </table>
        </div>
    </div>
}