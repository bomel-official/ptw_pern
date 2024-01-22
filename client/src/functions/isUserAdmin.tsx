import {IUser} from "../StoreTypes";

export function isUserAdmin(user: IUser | null | undefined, roles?: string[]) {
    if (!user) return false
    if (roles) {
        return roles.includes(user.role)
    }
    return (user.role === 'ADMIN' || user.role === 'SUPERADMIN')
}