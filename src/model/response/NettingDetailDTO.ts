export interface NettedTransactionDTO {
    "billAmount": {
        "amount": number,
        "currency": string
    },
    "counterParty": string,
    "date": string,
    "dueDate": string,
    "feeSaved": {
        "amount": number,
        "currency": string
    },
    "localAmount": {
        "amount": number,
        "currency": string
    },
    "transactionId": string,
    "type": string
}

export interface NettingDetailDTO {
    "createAt": string,
    "currency": string,
    "group": string,
    "id": string,
    "netCashFlow": {
        "amount": number,
        "numOfCounterParties": number,
        "numOfTransactions": number
    },
    "nettedTransactions": NettedTransactionDTO[],
    "payable": {
        "amount": number,
        "numOfCounterParties": number,
        "numOfTransactions": number
    },
    "potential": number,
    "receivable": {
        "amount": number,
        "numOfCounterParties": number,
        "numOfTransactions": number
    },
    "reportFile": {
        "extension": string,
        "name": string,
        "path": string,
        "size": number
    },
    "savingCash": {
        "after": number,
        "before": number,
        "savingAmount": number,
        "savingPercent": number
    },
    "savingFee": {
        "after": number,
        "before": number,
        "savingAmount": number,
        "savingPercent": number
    },
    "settlementDate": string,
    "status": string,
    "summary": {
        "cashOutFlow": {
            "after": number,
            "before": number
        },
        "currencies": {
            "after": number,
            "before": number
        },
        "fees": {
            "after": number,
            "before": number
        },
        "transactions": {
            "after": number,
            "before": number
        }
    },
    "uploadedFile": {
        "extension": string,
        "name": string,
        "path": string,
        "size": number
    }
}