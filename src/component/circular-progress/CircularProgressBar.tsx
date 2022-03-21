import "./circular-progress-bar.css"
import Canvas from "../Canvas";

interface Props {
    percent: string
    strokeWidth?: number
}

export default function CircularProgressBar(props: Props) {
    let percent = parseFloat(props.percent.replace("%", "")) / 100
    const strokeWidth = props.strokeWidth || 16;

    function drawHint(ctx: CanvasRenderingContext2D, strokeWidth: number, radius: number, start: number) {
        ctx.beginPath()
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2,
            radius,
            0, 2 * Math.PI)
        ctx.strokeStyle = "#f5f5f5"
        ctx.lineWidth = strokeWidth;
        ctx.stroke()
        ctx.closePath()
    }

    function drawProgress(ctx: CanvasRenderingContext2D, strokeWidth: number, radius: number, start: number) {
        ctx.beginPath()
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2,
            radius,
            start, start+percent * 2 * Math.PI)
        ctx.strokeStyle = "#00C853"
        ctx.lineWidth = strokeWidth;
        ctx.stroke()
        ctx.closePath()
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount) => {
        let size = Math.min(ctx.canvas.width, ctx.canvas.height)
        const radius = size / 2 - strokeWidth / 2
        const start = -Math.PI / 2
        drawHint(ctx, strokeWidth, radius, start)
        drawProgress(ctx, strokeWidth, radius, start)
        return false
    }
    return <div style={{display: "grid", color: "#00C853"}}>
        <div style={{gridArea: "1/1"}}><Canvas draw={draw}/></div>
        <h1 style={{gridArea: "1/1", justifySelf: "center", alignSelf: "center"}}>{props.percent}</h1>
    </div>
}