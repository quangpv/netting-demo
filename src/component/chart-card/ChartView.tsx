import {IMonthSaved} from "../../model/ui/INettingOverview";
import {Circle, Layer, Line, Stage, Text} from "react-konva";
import {useMemo} from "react";


function createItem(month: string, height: number): IMonthSaved {
    return {
        month: month,
        heightRate: height
    }
}

interface Props {
    items?: IMonthSaved[]
    lineColor?: string
    indicatorColor?: string
    filledColorStart?: string
    filledColorEnd?: string
}

const defaultItem = [
    createItem("Jan", 0),
    createItem("Feb", 0),
    createItem("Mar", 0),
    createItem("Apr", 0),
    createItem("May", 0),
    createItem("Jun", 0),
    createItem("Jul", 0),
]

export default function ChartView(props: Props) {
    let items = props.items || defaultItem

    let paddingVertical = 6
    let paddingLeft = 10
    let paddingRight = 4
    let lineWidth = 2
    let indicatorSize = 6
    let fontSize = 10
    let fontFamily = "Inter, sans-serif"
    let fontColor = "black"
    let lineColor = props.lineColor || "#00C853"
    let indicatorColor = props.indicatorColor || "#CCF4DD"
    let filledColorStart = props.filledColorStart || "#66DE98"
    let filledColorEnd = props.filledColorEnd || "#edfff5"
    const left = paddingLeft
    const top = paddingVertical

    const stageWidth = 210
    const stageHeight = 100
    const graphWidth = stageWidth - paddingLeft - paddingRight
    const graphHeight = stageHeight - paddingVertical * 2 - fontSize
    const segmentWidth = graphWidth / (items.length - 1)
    const offsetXOf = (index: number) => left + index * segmentWidth
    const offsetYOf = (it: IMonthSaved) => top + graphHeight * (1 - it.heightRate)

    let lines = useMemo(() => items.flatMap((it, index) => {
        return [offsetXOf(index), offsetYOf(it)]
    }), [items])
    let bounds = useMemo(() => {
        let list = items.flatMap((it, index) => {
            return [offsetXOf(index), offsetYOf(it)]
        })
        let lastHeight = top + graphHeight + lineWidth
        list.push(left + graphWidth)
        list.push(lastHeight)
        list.push(left)
        list.push(lastHeight)
        return list
    }, [items])

    let stops = useMemo(() => items.map((it, index) => {
        return [offsetXOf(index), offsetYOf(it), it]
    }), [items])

    return <div>
        <Stage width={stageWidth} height={stageHeight}>
            <Layer>
                {/*<Rect x={0} y={0} width={stageWidth} height={stageWidth} fill={"rgba(0,0,0,0.5)"}/>*/}
                <Line
                    points={bounds}
                    fillLinearGradientStartPointX={stageWidth / 2}
                    fillLinearGradientStartPointY={0}
                    fillLinearGradientEndPointX={stageWidth / 2}
                    fillLinearGradientEndPointY={stageHeight}
                    fillLinearGradientColorStops={[0, filledColorStart, 1, filledColorEnd]}
                    closed={true}
                />
                <Line
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                    points={lines}
                />
                {
                    stops.map(it => {
                        return <Circle
                            x={it[0] as number}
                            y={it[1] as number}
                            radius={indicatorSize / 2}
                            fill={indicatorColor}
                            stroke={lineColor}
                            strokeWidth={lineWidth}
                        />
                    })
                }
                {
                    stops.map((it, index) => {
                        if (index % 2 !== 0) return null
                        return <Text
                            text={(it[2] as IMonthSaved).month}
                            x={it[0] as number - fontSize}
                            y={stageHeight - fontSize}
                            fill={fontColor}
                            fontSize={fontSize}
                            fontFamily={fontFamily}
                            fontVariant={"lighter"}
                        />
                    })
                }
            </Layer>
        </Stage>
    </div>
}