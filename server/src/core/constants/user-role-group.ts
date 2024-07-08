import { UserRole } from "./user-role";

export const UserRoleGroup = {
    [UserRole.SUPERADMIN]: [ UserRole.SUPERADMIN ] as UserRole[],
    [UserRole.ADMIN]: [ UserRole.ADMIN, UserRole.SUPERADMIN ] as UserRole[],
    [UserRole.USER]: [ UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN ] as UserRole[],
};
