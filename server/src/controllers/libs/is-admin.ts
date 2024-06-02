import { UserRoleGroup } from "@constants";
import { JWTUserData } from "@core";
import { isUserInGroup } from "./is-user-in-group";

export function isAdmin( user: JWTUserData ) {
    return isUserInGroup( user.role, UserRoleGroup.ADMIN );
}
