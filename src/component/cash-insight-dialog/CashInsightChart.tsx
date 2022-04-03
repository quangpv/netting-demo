export interface IInsight {
    month: string;
    cashFlows: string[];
}

interface Props {
    items: IInsight[]
}


const initItems = [
    {month: "Thang 2", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 3", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 4", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 5", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
    {month: "Thang 6", cashFlows: ["1", "2", "3", "4"]},
]

export default function CashInsightChart(props: Props) {
    const items = props.items
    // const items = initItems
    return <div className={"cash-insight-chart"}>
        {
            items.map((it, index) => {
                const colNumber = (index + 1) * 2
                return <>
                    <div style={{
                        gridArea: `1/${colNumber}/1/span 2`,
                        display: "flex",
                        justifyContent: "center",
                        minWidth: "70px"
                    }}>
                        {it.month}
                    </div>
                    <div style={{gridArea: `2/${colNumber}/2/span 2`, display: "flex", justifyContent: "center"}}>
                        <div className={"insight-circle inactive"}/>
                    </div>
                    {
                        it.cashFlows.map((cash, cashIndex) => {
                            const rowNumber = cashIndex + 3
                            return <div style={{gridArea: `${rowNumber}/${colNumber}/${rowNumber}/span 2`}}>
                                {cash}
                            </div>
                        })
                    }
                </>
            })
        }
        {
            items.length > 1 && <div className={"insight-divider"} style={{
                gridArea: `2/3/2/span ${(items.length - 1) * 2}`
            }}/>
        }

    </div>
}