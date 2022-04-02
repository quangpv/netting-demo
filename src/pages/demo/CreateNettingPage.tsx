import "./create-netting-page.css"
import {useState} from "react";
import {useService} from "../../core/Injection";
import {useNavigate} from "react-router-dom";
import {Routing} from "../../app/Routing";
import {CreateNettingCmd} from "../../command/CreateNettingCmd";

export default function CreateNettingPage() {
    const [group, setGroup] = useState("")
    const createNettingCmd = useService(CreateNettingCmd)
    const navigate = useNavigate()
    const loading = createNettingCmd.loading.asState()

    const onInputChange = (e) => {
        setGroup(e.currentTarget.value)
    }
    createNettingCmd.success.subscribe(it => {
        navigate({pathname: Routing.detailOf(it)})
    })

    const onSubmit = () => createNettingCmd.invoke(group)
    const onBackToDemo = () => window.history.back()

    return <div className={"create-netting-page"}>
        <div className={"container"}>
            <h1>Create netting</h1>
            <label>Netting group</label>
            <input name={"group"} value={group} placeholder={"EX: Asia banks"} onChange={onInputChange}/>
            <button disabled={loading} className={"btn-create"} onClick={onSubmit}>Create</button>
            <button className={"btn-no-border"} onClick={onBackToDemo}>Back to demo</button>
        </div>
    </div>
}