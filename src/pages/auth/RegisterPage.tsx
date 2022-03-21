import "./register.css"
import React, {useState} from "react";
import {Routing} from "../../app/Routing";
import {useService} from "../../core/Injection";
import {RegisterCmd} from "../../command/RegisterCmd";
import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    let [state, setState] = useState({email: "", name: ""})
    let registerCmd = useService(RegisterCmd)
    let navigate = useNavigate()

    registerCmd.result.subscribe(it => {
        navigate({pathname: Routing.home})
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        let form = new FormData(e.currentTarget)
        registerCmd.invoke(form)
    }

    function backToLogin() {
        window.history.back()
    }

    function handleChange(e) {
        let target = e.currentTarget
        let newState = {...state}
        newState[target.name] = target.value
        setState(newState)
    }

    return <div className={"register"}>
        <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <label>Email</label>
            <input placeholder={"EX: test@gmail.com"}
                   type={"email"}
                   value={state.email}
                   onChange={handleChange}
                   name={"email"}/>

            <label>Name</label>
            <input placeholder={"EX: SHB Bank"}
                   type={"text"}
                   onChange={handleChange}
                   value={state.name}
                   name={"name"}/>
            <button className={"btn-registry"}>Submit</button>
            <button className={"btn-back-to-login"} onClick={backToLogin} type={"button"}>Back to login</button>
        </form>
    </div>
}