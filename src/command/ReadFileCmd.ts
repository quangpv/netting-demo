import {flowOf} from "../core/Flow";
import Papa from "papaparse";
import {GlobalErrorHandler} from "../app/GlobalErrorHandler";
import {Injectable} from "../core/Injection";
import {IFileLoading, ITransactionFile} from "../model/ui/Models";
import {TextFormatter} from "../app/TextFormatter";


@Injectable([GlobalErrorHandler, TextFormatter])
export class ReadFileCmd {
    flow = flowOf<ITransactionFile>(null)
    loading = flowOf<IFileLoading>({isLoading: false})

    constructor(private errorHandler: GlobalErrorHandler, private textFormatter: TextFormatter) {
    }

    invoke(file: File) {
        this.doInvoke(file).finally(() => {

        })
    }

    private async doInvoke(file: File) {
        if (file == null || file.type !== "text/csv") {
            this.flow.emit(null)
            return
        }

        const byteUnit = 1024
        let size = file.size
        let mega = Math.round(size / (byteUnit * byteUnit))
        let sizeText: string = this.textFormatter.formatSize(size)

        let shouldShowLoading = mega > 1
        if (shouldShowLoading) {
            this.loading.emit({isLoading: true, fileName: file.name})
        }
        Papa.parse(file, {
            complete: (results) => {
                let data = results.data
                let trans = data.map(it => this.createTransaction(it)).filter(it => it != null)

                if (trans.length === 0) {
                    this.errorHandler.handle(new Error(`File ${file.name} is not valid`))
                    this.loading.emit({isLoading: false})
                    return
                }

                let emit = () => {
                    this.loading.emit({isLoading: false})
                    this.flow.emit({
                        file: file,
                        name: file.name,
                        size: sizeText,
                        transactions: trans
                    })
                }
                if (shouldShowLoading) {
                    setTimeout(emit, 1000)
                } else {
                    emit()
                }
            }
        })
    }

    private createTransaction(it: any) {
        let arr = it as string[]
        if (arr.length !== 7) return null
        let date = arr[0]
        if (date.toLowerCase() === "date") return null
        return {
            date: date,
            due: arr[1],
            id: arr[2],
            type: arr[3],
            counterParty: arr[4],
            currency: arr[5],
            amount: this.textFormatter.formatAmount(parseFloat(arr[6]))
        }
    }
}