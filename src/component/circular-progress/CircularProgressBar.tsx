import {Arc, Layer, Stage, Text} from "react-konva";

interface Props {
    percent: string
    strokeWidth?: number
}

export default function CircularProgressBar(props: Props) {
    let rate = parseFloat(props.percent.replace("%", "")) / 100
    const strokeWidth = props.strokeWidth || 16;
    const color = "#00C853"
    const strokeColor = "#f5f5f5"

    const padding = 20
    const circleSize = 150
    const stageSize = circleSize + padding
    const innerRadius = circleSize / 2 - strokeWidth
    const outerRadius = circleSize / 2

    return <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Stage width={stageSize} height={stageSize}>
            <Layer>
                <Arc angle={360}
                     x={stageSize / 2}
                     y={stageSize / 2}
                     innerRadius={innerRadius}
                     outerRadius={outerRadius}
                     fill={strokeColor}/>
                <Arc
                    angle={rate * 360}
                    x={stageSize / 2}
                    rotationDeg={-90}
                    y={stageSize / 2}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill={color}/>

                <Text
                    x={0}
                    y={0}
                    width={stageSize}
                    height={stageSize}
                    align={"center"}
                    verticalAlign={"middle"}
                    text={props.percent}
                    fill={color}
                    fontFamily={"Inter, sans-serif"}
                    fontStyle={"bold"}
                    fontSize={24}
                />
            </Layer>
        </Stage>
    </div>
}