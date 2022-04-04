import React, {useState} from "react";
import {useService} from "../../core/Injection";
import {useNavigate} from "react-router-dom";
import {LoginCmd} from "../../command/LoginCmd";
import "./login.css"
import {Routing} from "../../app/Routing";
import {launch} from "../../core/HookExt";

interface LoginState {
    email: string
}

export default function LoginPage() {
    let navigate = useNavigate()
    let [state, setState] = useState<LoginState>({
        email: "",
    })
    let loginCmd = useService(LoginCmd)

    loginCmd.result.subscribe(it => {
        navigate({pathname: Routing.home})
    });

    let handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let form = new FormData(e.currentTarget)
        loginCmd.invoke(form)
    };

    function handleEvent(e: React.ChangeEvent<HTMLInputElement>) {
        let target = e.currentTarget
        let newState = {...state}
        newState[target.name] = target.value
        setState(newState)
    }

    return (
        <div className={"login-container"}>
            <form onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <div>
                    <label>Email</label>
                    <input placeholder={"EX: test@gmail.com"}
                           type={"email"}
                           value={state.email}
                           onChange={handleEvent}
                           name={"email"}/>
                </div>
                <button>Login</button>
            </form>
        </div>
    );
}