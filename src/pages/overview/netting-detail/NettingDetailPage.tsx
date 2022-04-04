import "./netting-detail.css"
import AppIcon from "../../../component/AppIcon";
import NettingStatusWidget from "../../../component/netting-status/NettingStatusWidget";
import PaymentCard from "../../../component/payment-card/PaymentCard";
import {useNavigate, useParams} from "react-router-dom";
import {useService} from "../../../core/Injection";
import {launch} from "../../../core/HookExt";
import {FetchNettingInfoCmd} from "../../../command/FetchNettingInfoCmd";
import UploadTransactionDialog from "../../../component/upload-transaction/UploadTransactionDialog";
import {useState} from "react";
import SubmitTransactionDialog from "../../../component/upload-transaction/SubmitTransactionDialog";
import NettingDescSection from "../../../component/netting-description/NettingDescSection";
import {EmptySection} from "../../../component/EmptySection";
import {ITransactionFile} from "../../../model/ui/Models";
import NettingReportSection from "../../../component/netting-report/NettingReportSection";
import NettedTable from "../../../component/netted-table/NettedTable";
import ExcludedTransactionTable from "../../../component/excluded-tran-table/ExcludedTransactionTable";
import CashFlowPaymentDialog from "../../../component/cash-flow-payment-dialog/CashFlowPaymentDialog";
import EstimateSavingSection from "../../../component/estimate-saving/EstimateSavingSection";
import {PayCmd} from "../../../command/PayCmd";
import CashInsightDialog from "../../../component/cash-insight-dialog/CashInsightDialog";


const DIALOG_NONE = -1
const DIALOG_UPLOAD = 0
const DIALOG_SUBMIT = 1
const DIALOG_PAYMENT = 2
const DIALOG_INSIGHT = 3

interface State {
    dialogType: number
    file?: ITransactionFile | null
}

export default function NettingDetailPage() {
    let navigate = useNavigate()
    let {id} = useParams()
    let fetchNettingInfo = useService(FetchNettingInfoCmd)
    let [state, setState] = useState<State>({dialogType: DIALOG_NONE})
    let nettingInfo = fetchNettingInfo.flow.asState()
    let payCmd = useService(PayCmd)

    payCmd.success.subscribe(it => {
        setState({dialogType: DIALOG_NONE})
    })

    launch(() => fetchNettingInfo.invoke(id))

    let handleBackClick = () => {
        navigate(-1)
    }
    let onShowUploadDialog = () => {
        setState({dialogType: DIALOG_UPLOAD})
    }
    let onCloseDialog = () => {
        setState({dialogType: DIALOG_NONE})
    }
    let onSubmitUpload = (file: ITransactionFile) => {
        setState({dialogType: DIALOG_SUBMIT, file: file})
    }
    let onInsightClick = () => {
        setState({dialogType: DIALOG_INSIGHT})
    }
    let onPaymentClick = (e) => {
        e.preventDefault()
        setState({dialogType: DIALOG_PAYMENT})
    }
    let onPayClick = (e) => {
        e.preventDefault()
        payCmd.invoke(id)
    }

    return <div className={"netting-detail"}>
        <div className={"netting-status-nav"}>
            <AppIcon src={"ic_arrow_back.svg"} onClick={handleBackClick}/>
            <NettingStatusWidget status={nettingInfo.status}/>
            <span>{nettingInfo.nettingId}</span>
        </div>

        <NettingDescSection
            status={nettingInfo.status}
            desc={nettingInfo.description}
            onPaymentClick={onPaymentClick}
            onShowUploadDialog={onShowUploadDialog}/>

        <div className={"divider-horizontal"}/>

        <div className={"payment-card-group"}>
            <PaymentCard
                type={"Receivable"}
                info={nettingInfo.receivable}
                icon={"ic_receivable.svg"}
                color={"--colorGreen"}
            />
            <PaymentCard
                type={"Payable"}
                info={nettingInfo.payable}
                icon={"ic_payable.svg"}
                color={"--colorRed"}
            />
            <PaymentCard
                type={"Net Cashflow"}
                info={nettingInfo.netCashFlow}
                icon={"ic_net_cashflow.svg"}
                color={"--colorBlack"}/>
        </div>

        <div className={"transaction-group"}>
            <div>
                <label className={"label-icon"}> <AppIcon src={"ic_netting_chart.svg"}/> Estimated Savings</label>
                {
                    nettingInfo.isInProgress ?
                        <EstimateSavingSection item={nettingInfo.estimatedSaving}/> :
                        EmptySection("Upload your Excel file to calculate the Estimated Savings")
                }
            </div>
            <div>
                <label className={"label-icon"}> <AppIcon src={"ic_netting_report.svg"}/> Netting Report</label>
                {
                    nettingInfo.isInProgress ?
                        <NettingReportSection
                            reports={nettingInfo?.nettingReports}
                            onInsightClick={onInsightClick}
                        /> : EmptySection("Upload your Excel file to generate the Netting Report")
                }
            </div>
        </div>

        <NettedTable items={nettingInfo.nettedTransactions}/>

        <ExcludedTransactionTable items={nettingInfo.excludedTransactions}/>

        <UploadTransactionDialog
            isShow={state.dialogType === DIALOG_UPLOAD}
            onClose={onCloseDialog}
            onSubmit={onSubmitUpload}/>

        <SubmitTransactionDialog
            file={state.file}
            isShow={state.dialogType === DIALOG_SUBMIT}
            onClose={onCloseDialog}
            nettingId={id}/>

        <CashFlowPaymentDialog
            isShow={state.dialogType === DIALOG_PAYMENT}
            onClose={onCloseDialog}
            onPayClick={onPayClick}
            amount={nettingInfo.payable.amount}
        />
        <CashInsightDialog
            before={nettingInfo.insightBefore}
            after={nettingInfo.insightAfter}
            isShow={state.dialogType === DIALOG_INSIGHT}
            onClose={onCloseDialog}/>
    </div>
}