import { UserRole } from "./user-role";

export const UserRoleGroup = {
    [UserRole.SUPERADMIN]: [ UserRole.SUPERADMIN ],
    [UserRole.ADMIN]: [ UserRole.ADMIN, UserRole.SUPERADMIN ],
    [UserRole.USER]: [ UserRole.USER, UserRole.ADMIN, UserRole.SUPERADMIN ],
};
