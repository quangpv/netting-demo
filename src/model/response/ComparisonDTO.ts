export interface ComparisonDTO {
    "compares": CompareItemDTO[],
    "exchangeRate": number,
    "homeCurrency": string,
    "invoiceCurrency": string,
    "lastTime": string
}

export interface CompareItemDTO {
    "exchangeRate": number,
    "logo": string,
    "name": string,
    "loss": number,
    "totalPayment": number,
    "transferFee": number
}