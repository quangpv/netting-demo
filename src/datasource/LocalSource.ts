import {Singleton} from "../core/Injection";
import {Flow, flowOf} from "../core/Flow";
import {NettingCycleDTO, NettingOverviewDTO, NettingParamDTO} from "./RemoteSource";
import {NettingDetailDTO} from "../model/response/NettingDetailDTO";

@Singleton()
export class LocalSource {
    readonly emailFlow: Flow<string>;
    private cycles: NettingCycleDTO[];
    private overview: NettingOverviewDTO;
    private nettingParams: NettingParamDTO[];
    private nettingDetailFlow = {}

    constructor() {
        let email = localStorage.getItem("email")
        this.emailFlow = flowOf(email == null ? "" : email)
    }

    saveEmail(email: string) {
        localStorage.setItem("email", email as string)
        this.emailFlow.emit(email as string)
    }

    removeEmail() {
        localStorage.removeItem("email")
        this.emailFlow.emit("")
    }

    saveToken(token: string) {
        localStorage.setItem("token", token)
    }

    getToken(): string | null {
        return localStorage.getItem("token")
    }

    removeToken() {
        return localStorage.removeItem("token")
    }

    saveNettingCycles(data: NettingCycleDTO[]) {
        this.cycles = data
    }

    getNettingCycles(): NettingCycleDTO[] | null {
        return this.cycles
    }

    getOverview(): NettingOverviewDTO | null {
        return this.overview
    }

    saveOverview(result: NettingOverviewDTO) {
        this.overview = result
    }

    saveNettingParams(result: NettingParamDTO[]) {
        this.nettingParams = result
    }

    getNettingParams(): NettingParamDTO[] {
        return this.nettingParams
    }

    saveNettingDetail(id: string, response: NettingDetailDTO) {
        if (this.nettingDetailFlow.hasOwnProperty(id)) {
            return this.nettingDetailFlow[id].emit(response)
        }
        this.nettingDetailFlow[id] = flowOf(response)
    }

    getNettingDetailFlow(id: string): Flow<NettingDetailDTO> {
        console.log(this.nettingDetailFlow)
        if (this.nettingDetailFlow.hasOwnProperty(id)) {
            return this.nettingDetailFlow[id]
        }
        let flow = new Flow<NettingDetailDTO>()
        this.nettingDetailFlow[id] = flow
        return flow;
    }
}
