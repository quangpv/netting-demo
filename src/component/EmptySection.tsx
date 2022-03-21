export function EmptySection(message: string) {
    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", flex: 1}}>
        <span style={{color: "var(--colorGray)"}}>{message}</span>
    </div>
}