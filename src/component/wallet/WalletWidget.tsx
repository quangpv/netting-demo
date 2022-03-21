import ic_wallet from "../../icons/ic_wallet.svg";
import React from "react";
import "./wallet.css"

export function WalletWidget() {
    return (
        <div className={"wallet"}>
            <div>
                <img src={ic_wallet} width={16} height={16} alt={""}/>
                <span>Wallet: </span>
                <span>SGD $1823497</span>
            </div>
        </div>
    )
}