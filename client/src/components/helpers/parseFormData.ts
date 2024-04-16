export const parseFormData = <TData extends Record<string, any>>(data: TData): FormData => {
    const parsedData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        if (!value) {
            parsedData.append(key, '')
        } else if (value instanceof File || typeof value === 'string') {
            parsedData.append(key, value)
        } else if (typeof value === 'number') {
            parsedData.append(key, `${value}`)
        } else {
            parsedData.append(key, JSON.stringify(value))
        }
    }
    return parsedData
}