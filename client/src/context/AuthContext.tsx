import {createContext} from 'react'
import {IUser} from "../StoreTypes";

function noop() {}

interface IAuthContext {
    token: null | string,
    user: null | IUser,
    login: ((jwtToken: string|null) => void) | (() => void),
    logout: () => void,
    isAuthenticated: boolean
}

export const AuthContext = createContext<IAuthContext>({
    token: null,
    user: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})
