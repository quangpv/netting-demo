export enum NettingStatus {
    None = -1,
    Open = 0,
    Processing = 1,
    Settled = 2
}

export function nettingStatusOfName(value: string): NettingStatus {
    switch (value.toLowerCase()) {
        case "open":
            return NettingStatus.Open
        case "inprogress":
            return NettingStatus.Processing
        case "settled":
            return NettingStatus.Settled
        default:
            return NettingStatus.None
    }
}

export function nettingStatusOfValue(value: number): NettingStatus {
    let result = [NettingStatus.Open, NettingStatus.Processing, NettingStatus.Settled]
        .find(it => it === value)
    if (result >= 0) return result
    return NettingStatus.None
}