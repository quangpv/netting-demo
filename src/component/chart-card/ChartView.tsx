import Canvas from "../Canvas";
import {IMonthSaved} from "../../model/ui/INettingOverview";


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

export default function ChartView(props: Props) {
    let items = props.items || [
        createItem("Jan", 0),
        createItem("Feb", 0),
        createItem("Mar", 0),
        createItem("Apr", 0),
        createItem("May", 0),
        createItem("Jun", 0),
        createItem("Jul", 0),
    ]

    let padding = 5
    let lineWidth = 2
    let indicatorSize = 8
    let monthHeight = 20
    let fontSize = "16px Inter, sans-serif"
    let fontColor = "black"
    let lineColor = props.lineColor || "#00C853"
    let indicatorColor = props.indicatorColor || "#CCF4DD"
    let filledColorStart = props.filledColorStart || "#66DE98"
    let filledColorEnd = props.filledColorEnd || "#edfff5"

    function onDraw(ctx: CanvasRenderingContext2D, frameCount: number): boolean {
        let viewHeight = ctx.canvas.height - padding * 2
        let viewWidth = ctx.canvas.width - padding * 2
        let segmentWidth = viewWidth / (items.length - 1)
        let left = padding
        let top = padding
        let filledHeight = viewHeight - monthHeight

        let getOffsetY = (it) => filledHeight * (1 - it.heightRate) + top
        let getOffsetX = (index) => index * segmentWidth + left

        let drawLinePath = () => {
            ctx.strokeStyle = lineColor
            ctx.lineWidth = lineWidth;
            ctx.beginPath()
            items.forEach((it, index) => {
                let offsetY = getOffsetY(it)
                let offsetX = getOffsetX(index)
                if (index === 0) {
                    ctx.moveTo(offsetX, offsetY)
                } else {
                    ctx.lineTo(offsetX, offsetY)
                }
            })
            ctx.stroke()
        }

        let drawIndicator = () => {
            let halfIndicatorSize = indicatorSize / 2
            ctx.strokeStyle = lineColor
            ctx.fillStyle = indicatorColor
            ctx.lineWidth = lineWidth;
            items.forEach((it, index) => {
                let offsetY = getOffsetY(it)
                let offsetX = getOffsetX(index)
                ctx.beginPath()
                ctx.arc(offsetX,
                    offsetY,
                    halfIndicatorSize, 0, 360, false)
                ctx.fill()
                ctx.stroke()
            })
        }

        let drawFilledPath = () => {
            let grd = ctx.createLinearGradient(0, 0, 0, filledHeight);

            grd.addColorStop(0, filledColorStart);
            grd.addColorStop(1, filledColorEnd);
            ctx.fillStyle = grd
            ctx.beginPath()
            ctx.moveTo(left, top + filledHeight)
            items.forEach((it, index) => {
                let offsetY = getOffsetY(it)
                let offsetX = getOffsetX(index)
                ctx.lineTo(offsetX, offsetY)
            })
            ctx.lineTo(left + viewWidth, top + filledHeight)
            ctx.closePath()
            ctx.fill()
        }
        let drawMonth = () => {
            ctx.fillStyle = fontColor;
            items.forEach((it, index) => {
                if (index % 2 !== 0) return
                let offsetY = viewHeight + top
                let offsetX = getOffsetX(index)
                if (index === 0) {
                    offsetX += ctx.measureText(it.month).width / 3
                } else if (index === items.length - 1) {
                    offsetX -= ctx.measureText(it.month).width / 3
                }
                ctx.font = fontSize;
                ctx.textAlign = "center"
                ctx.fillText(it.month, offsetX, offsetY)
            })
        }
        drawFilledPath()
        drawLinePath()
        drawIndicator()
        drawMonth()
        return false
    }

    return <Canvas draw={onDraw} style={{maxHeight: 100, minWidth: 170}}/>
}