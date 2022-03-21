interface AppIconProps {
    className?: string | undefined;
    src: string
    onClick?: (e) => void
    width?: number | undefined
    height?: number | undefined
}

export default function AppIcon(props: AppIconProps) {
    return <img
        src={require(`../icons/${props.src}`)}
        alt={""}
        width={props.width}
        height={props.height}
        className={props.className}
        onClick={props.onClick}
    />
}