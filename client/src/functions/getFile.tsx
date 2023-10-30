import {API_URL} from "../hooks/http.hook";

export const getFile = (filename: string) => {
    return `${API_URL}/static/${filename}`
}