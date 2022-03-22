import {useState} from "react";
import AppIcon from "../AppIcon";
import {Menu, MenuItem} from "@mui/material";

export interface ICurrency {
    currency: string;
    flagIcon: string;
}

interface Props {
    items?: ICurrency[]
    onItemClick?: (item: ICurrency) => void
    selected?: ICurrency
}

export function CurrencyDropDown(props: Props) {
    let {items} = props
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        e.preventDefault();
        setAnchorEl(null);
    };
    const onItemClick = (e, it) => {
        e.preventDefault();
        setAnchorEl(null);
        props.onItemClick(it);
    }

    function CurrencyView(it: ICurrency) {
        return <span style={{display: "flex", gap: 10, alignItems: "center"}}>
                    <AppIcon src={it.flagIcon} width={24}
                             height={24}/> {it.currency}
                </span>
    }

    return <>
        <div className={"select"} onClick={handleClick}>
            {props.selected != null ? CurrencyView(props.selected) : <span>Select</span>}
            <AppIcon src={"ic_dropdown.svg"} width={18} height={18}/>
        </div>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {
                items?.map(it => {
                    return <MenuItem key={it.currency} onClick={(e) => onItemClick(e, it)}>
                        <CurrencyView currency={it.currency} flagIcon={it.flagIcon}/>
                    </MenuItem>
                })
            }
        </Menu>
    </>
}