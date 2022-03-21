import {AppError} from "../exception/AppError";

export class AppValidator {

    checkEmail(email: string) {
        if (email.length === 0)
            throw new AppError("Email should not be blank")

        let isAccept = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        if (!isAccept)
            throw new AppError("Email is invalid format")
    }

    checkName(name: string) {
        if (name.length === 0)
            throw new AppError("Name should not be blank")
    }
}