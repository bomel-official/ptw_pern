export const toDateTimeFormat = (dateTime: Date) => {
    return `${dateTime.getDate() >= 10 ? dateTime.getDate() : '0' + dateTime.getDate()}.${dateTime.getMonth() + 1}.${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes() >= 10 ? dateTime.getMinutes() : '0' + dateTime.getMinutes()}`
}