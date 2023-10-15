import {useState, useCallback, useEffect} from 'react'
import jwt_decode from "jwt-decode";
import {IUser} from "../StoreTypes";

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState<string|null>(null)
    const [ready, setReady] = useState<boolean>(false)
    const [userId, setUserId] = useState<number|null>(null)
    const [userNickname, setUserNickname] = useState<string|null>(null)
    const [userRole, setUserRole] = useState<string|null>(null)

    const login = useCallback((jwtToken: string|null): void => {
        setToken(jwtToken)

        const decoded: IUser = jwt_decode(jwtToken || '')
        setUserRole(decoded.role)
        setUserId(decoded.id)
        setUserNickname(decoded.nickname)

        localStorage.setItem(storageName, jwtToken ? jwtToken : '')
    }, [])


    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUserNickname(null)
        setUserRole(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const token = localStorage.getItem(storageName)

        if (token) {
            login(token)
        }
        setReady(true)
    }, [login])


    return { login, logout, token, userId, ready, userNickname, userRole}
}
