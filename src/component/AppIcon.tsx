interface AppIconProps {
    className?: string | undefined;
    src: string
    onClick?: (e) => void
    width?: number | undefined
    height?: number | undefined
}

export default function AppIcon(props: AppIconProps) {
    let src: any
    try {
        src = require(`../icons/${props.src}`)
    } catch (e) {
        require(`../icons/ic_logo.svg`)
    }
    return <img
        src={src}
        alt={""}
        width={props.width}
        height={props.height}
        className={props.className}
        onClick={props.onClick}
    />
}