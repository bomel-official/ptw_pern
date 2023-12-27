import {IUser} from "../StoreTypes";

export function isUserAdmin(user: IUser, roles?: string[]) {
    if (roles) {
        return roles.includes(user.role)
    }
    return (user.role === 'ADMIN' || user.role === 'SUPERADMIN')
}