import "./instruction-page.css"
import {Navigate} from "react-router-dom";
import {Routing} from "../../app/Routing";


export default function DemoPage() {
    return <Navigate to={Routing.instruction}/>
}