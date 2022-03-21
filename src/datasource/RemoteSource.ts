import {ApiError, AppError} from "../exception/AppError";
import {formDataToJson, objectToQueryString} from "../utils/FormDataUtils";
import {Singleton} from "../core/Injection";
import {LocalSource} from "./LocalSource";
import {NettingDetailDTO} from "../model/response/NettingDetailDTO";

@Singleton([LocalSource])
export class RemoteSource {
    private readonly endpoint: string;

    constructor(private localSource: LocalSource) {
        this.endpoint = "http://api-netting-demo.duckdns.org"
    }

    private async get(path: string, params?: any) {
        let url = `${this.endpoint}/${path}`
        if (params != null) {
            url = `${url}?${objectToQueryString(params)}`
        }
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.localSource.getToken()}`
            }
        })
        let result = await data.json()
        console.log(result)
        if (!data.ok) throw new ApiError(result)
        return result
    }

    private async post(path: string, data: any, contentType: string = 'application/json') {
        let options: RequestInit = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': contentType,
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.localSource.getToken()}`,
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: data // body data type must match "Content-Type" header
        }
        if (contentType == null) delete options.headers['Content-Type']
        let url = `${this.endpoint}/${path}`
        let result = await fetch(url, options)
        if (!result.ok) {
            throw new ApiError(await result.json())
        }
        return result
    }

    async login(form: FormData) {
        return await this.post("auth/party/login", formDataToJson(form))
            .then(it => it.json()) as LoginDTO
    }

    async registry(formData: FormData) {
        return await this.post("auth/party/registry", formDataToJson(formData))
            .then(it => it.json()) as LoginDTO
    }

    async fetchNettingParams() {
        return await this.get("netting-params") as ListDTO<NettingParamDTO>
    }

    async fetchNettingCycles(page: number = 0, pageSize: number = 1000000) {
        return await this.get("netting-cycles", {
            page: page,
            size: pageSize
        }) as ListDTO<NettingCycleDTO>
    }

    async fetchNettingOverview() {
        return await this.get("netting-cycles/overview") as NettingOverviewDTO
    }

    async fetchNettingById(id: string) {
        return await this.get(`netting-cycles/${id}`) as NettingDetailDTO
    }

    async payment(id: string) {
        await this.post(`settlement/${id}`, JSON.stringify({amount: 0}))
    }

    async uploadTransactions(id: string, file: File) {
        let form = new FormData()
        form.append("csv", file, file.name)
        await this.post(`transactions/${id}`, form, null)
    }

    private uuid() {
        const chars = '0123456789abcdef'.split('');

        let uuid = [], rnd = Math.random, r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4'; // version 4

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | rnd() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }

        return uuid.join('');
    }
}

export interface LoginDTO {
    accessToken: string
}

export interface ListDTO<T> {
    data: T[]
    metadata: {
        page: number
        total: number
    }
}

export interface NettingParamDTO {
    atLocation: string,
    destinationLocations: string,
    exchangeRate: number,
    fee: number,
    fixedFee: number,
    fromCurrency: string,
    id: string,
    margin: number,
    maxFee: number,
    minFee: number,
    toCurrency: string
}

export interface NettingCycleDTO {
    "createAt": string,
    "group": string,
    "id": string,
    "payable": {
        "amount": number,
        "currency": string
    },
    "receivable": {
        "amount": number,
        "currency": string
    },
    "savingCash": {
        "amount": number,
        "currency": string
    },
    "savingFee": {
        "amount": number,
        "currency": string
    },
    "settlementDate": string,
    "status": string,
    "transactionCount": number
}

export interface NettingOverviewDTO {
    "cashFlow": number,
    "cashFlowSaved": {
        "savedInMonth": number,
        "savedList": [
            {
                "amount": number,
                "month": string
            }
        ],
        "savedYTD": number
    },
    "currency": string,
    "feeSaved": {
        "savedInMonth": number,
        "savedList": [
            {
                "amount": number,
                "month": string
            }
        ],
        "savedYTD": number
    },
    "month": string,
    "payable": number,
    "receivable": number
}
