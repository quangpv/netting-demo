import {useState} from "react";
import {Menu, MenuItem} from "@mui/material";
import "./btn-account.css"

interface AccountButtonProps {
    email: string
    onLogoutClick: () => void
}

export function AccountButton(props: AccountButtonProps) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        e.preventDefault()
        setAnchorEl(null);
    };
    const handleLogout = (e) => {
        handleClose(e)
        props.onLogoutClick();
    };
    return (<div>
        <div className={"btn-account"} onClick={handleClick}>
            <div className={"circle"}>A</div>
            <span>{props.email}</span>
            <span className="material-icons" style={{fontSize: 16}}>expand_more</span>
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </div>)
}
