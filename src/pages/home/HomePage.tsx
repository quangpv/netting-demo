import {useService} from "../../core/Injection";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import './home.css';
import logo from "../../icons/ic_logo.svg"
import {Routing} from "../../app/Routing";
import {AccountButton} from "../../component/account-button/AccountButton";
import {LogoutCmd} from "../../command/LogoutCmd";
import React from "react";
import {RetrieveEmailCmd} from "../../command/RetrieveEmailCmd";
import {launch} from "../../core/HookExt";

const routes = [
    {routing: Routing.demo, name: "Demo"},
    {routing: Routing.overview, name: "Overview"},
    {routing: Routing.exchangeRate, name: "Exchange Rates"},
    {routing: Routing.rateComparison, name: "Rate Comparison"},
]

export default function HomePage() {
    let navigate = useNavigate()
    let logoutCmd = useService(LogoutCmd)
    let email = useService(RetrieveEmailCmd).invoke()

    let handleLogout = () => {
        logoutCmd.execute()
        navigate({pathname: Routing.login})
    }
    let getActiveClass = (path) => {
        return window.location.pathname.includes(path) ? "active-link" : ""
    }
    let handleLogoClick = () => {
        navigate({pathname: Routing.demo})
    }
    launch(() => {
        if (Routing.home === window.location.pathname) {
            navigate({pathname: Routing.demo})
        }
    })
    return (<div className={"home-container"}>
        <div className={"home-header"}>
            <header>
                <img onClick={handleLogoClick} src={logo} width={32} height={32} alt={""}/>
                <h1 onClick={handleLogoClick}>Onehypernet</h1>
                <div/>
                <AccountButton email={email} onLogoutClick={handleLogout}/>
            </header>
            <nav>
                {
                    routes.map(item => {
                        return <NavLink
                            key={item.routing}
                            className={`my-nav-link ${getActiveClass(item.routing)}`}
                            to={item.routing}>{item.name}</NavLink>
                    })
                }
                {/*<WalletWidget/>*/}
            </nav>
            <div className={"divider-horizontal"}/>
        </div>
        <Outlet/>
    </div>)
}