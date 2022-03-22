import {Outlet, useNavigate} from "react-router-dom";
import React, {useCallback, useEffect} from "react";
import {useService} from "../core/Injection";
import {CheckLoginCmd} from "../command/CheckLoginCmd";
import {Routing} from "../app/Routing";
import {launch} from "../core/HookExt";
import {GlobalErrorHandler, RegistrableGlobalErrorHandler} from "../app/GlobalErrorHandler";
import {Alert, Snackbar} from "@mui/material";

export default function MainPage() {
    let checkLogin = useService(CheckLoginCmd)
    let navigate = useNavigate()
    let globalErrorHandler = useService(GlobalErrorHandler)
    const [error, setError] = React.useState({
        open: false,
        message: ""
    });

    const onException = useCallback((event) => {
        setError({open: true, message: event.reason});
    }, []);

    useEffect(() => {
        window.addEventListener("unhandledrejection", onException);

        return () => {
            window.removeEventListener("unhandledrejection", onException);
        };
        /* eslint-disable react-hooks/exhaustive-deps */
    }, []);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        setError({...error, open: false});
    };

    useEffect(() => {
        if (!checkLogin.isLogged() && window.location.pathname ! in Routing.protectedRoutes) {
            navigate({pathname: Routing.login})
        }
    }, [window.location.pathname])

    launch(() => {
        if (globalErrorHandler instanceof RegistrableGlobalErrorHandler) {
            return globalErrorHandler.error.collect(error => {
                setError({open: true, message: error.message});
            })
        }
    })

    return <div>
        <Outlet/>
        <Snackbar
            open={error.open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        >

            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {error.message}
            </Alert>
        </Snackbar>
    </div>
}

