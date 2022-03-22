import React, {HTMLProps, useEffect, useRef} from 'react'

interface Props extends HTMLProps<any> {
    draw: (context: CanvasRenderingContext2D, frameCount: number) => boolean // return continue to animate
}

export default function Canvas(props: Props) {
    let {draw, ...canvasProps} = props
    const canvasRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current
        const context: CanvasRenderingContext2D = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height)
            frameCount++
            if (draw(context, frameCount)) {
                animationFrameId = window.requestAnimationFrame(render)
            } else {
                window.cancelAnimationFrame(animationFrameId)
            }
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return <canvas ref={canvasRef} {...canvasProps} />
}