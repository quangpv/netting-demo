import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import React from "react";
import MainPage from "./pages/MainPage";
import DemoPage from "./pages/demo/DemoPage";
import {Routing} from "./app/Routing";
import ExchangeRatePage from "./pages/exchange-rate/ExchangeRatePage";
import OverviewPage from "./pages/overview/OverviewPage";
import RateComparisonPage from "./pages/comparison/RateComparisonPage";
import NettingCyclesPage from "./pages/overview/netting-cycles/NettingCyclesPage";
import NettingDetailPage from "./pages/overview/netting-detail/NettingDetailPage";
import RegisterPage from "./pages/auth/RegisterPage";
import InstructionPage from "./pages/demo/InstructionPage";
import CreateNettingPage from "./pages/demo/CreateNettingPage";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}>
                <Route index element={<HomePage/>}/>
                <Route path={Routing.register} element={<RegisterPage/>}/>
                <Route path={Routing.login} element={<LoginPage/>}/>
                <Route path={Routing.home} element={<HomePage/>}>
                    <Route index element={<DemoPage/>}/>
                    <Route path={Routing.demo} element={<DemoPage/>}/>
                    <Route path={Routing.instruction} element={<InstructionPage/>}/>
                    <Route path={Routing.createNetting} element={<CreateNettingPage/>}/>
                    <Route path={Routing.overview} element={<OverviewPage/>}>
                        <Route index element={<NettingCyclesPage/>}/>
                        <Route path={Routing.nettingCycles} element={<NettingCyclesPage/>}/>
                        <Route path={Routing.detail} element={<NettingDetailPage/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Route>
                    <Route path={Routing.exchangeRate} element={<ExchangeRatePage/>}/>
                    <Route path={Routing.rateComparison} element={<RateComparisonPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}