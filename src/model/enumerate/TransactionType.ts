export enum TransactionType {
    Payable,
    Receivable
}

export function transactionTypeOf(name: string): TransactionType {
    let typeName = name.toLowerCase()
    if (typeName === "payable") return TransactionType.Payable
    return TransactionType.Receivable
}