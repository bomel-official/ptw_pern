export const getDateString = (date: Date, format: 'dd.mm.yyyy h:i' | 'dd.mm.yyyy' = 'dd.mm.yyyy'): string => {
    switch (format) {
        case "dd.mm.yyyy":
            return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}.${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}.${date.getFullYear()}`
        case "dd.mm.yyyy h:i":
            return `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`
    }
    return ''
}