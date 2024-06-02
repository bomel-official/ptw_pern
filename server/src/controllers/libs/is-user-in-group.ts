import { UserRole, UserRoleGroup } from "@constants";

export function isUserInGroup( userRole: UserRole,
                               userRoleGroup: (typeof UserRoleGroup)[keyof typeof UserRoleGroup] ) {
    return (userRoleGroup as UserRole[]).includes( userRole );
}
