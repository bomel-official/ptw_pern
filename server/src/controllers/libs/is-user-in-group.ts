export function isUserInGroup( userRole: string | undefined,
                               userRoleGroup: string[] ) {
    return userRole && userRoleGroup.includes( userRole );
}
