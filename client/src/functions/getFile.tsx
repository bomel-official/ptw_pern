import {API_URL} from "../hooks/http.hook";

export const getFile = (filename: string|null|undefined) => {
    if (!filename) return '';

    return `${API_URL}/static/${filename}`
}