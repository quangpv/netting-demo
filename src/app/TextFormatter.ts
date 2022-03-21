export class TextFormatter {
    private months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    formatAmount(amount: number) {
        return amount.toFixed(2);
    }

    formatYearMonth(month: string) {
        let date = new Date(month)
        return `${date.getFullYear()} ${this.months[date.getMonth()].toUpperCase()}`;
    }

    formatDate(createAt: string) {
        let date = new Date(createAt)
        let month = (this.months[date.getMonth()] as string).substring(0, 3)
        let day = date.getDate().toLocaleString([], {minimumIntegerDigits: 2})
        return `${day}-${month}-${date.getFullYear() % 100} `;
    }

    formatDate1(createAt: string) {
        let date = new Date(createAt)
        let month = (this.months[date.getMonth()] as string).substring(0, 3)
        let day = date.getDate().toLocaleString([], {minimumIntegerDigits: 2})
        return `${day} ${month}, ${date.getFullYear() % 100} `;
    }

    formatMonth(month: string) {
        let date = new Date(month)
        return (this.months[date.getMonth()] as string).substring(0, 3);
    }

    formatCash(currency: string, amount: number) {
        return `${currency} ${this.formatAmount(amount)}`
    }

    formatSize(size: number) {
        const byteUnit = 1024
        let mega = Math.round(size / (byteUnit * byteUnit))

        if (mega > 0) {
            return `${mega} Mb`
        }
        let kilo = Math.round((size / byteUnit) % byteUnit)
        if (kilo > 0) {
            return `${kilo} Kb`
        }
        return `${size} B`
    }
}