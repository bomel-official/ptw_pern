import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import { selectUserRole } from "@/entities/session";

interface RequireRoleProps {
    roles: string[];
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * Route-level guard: renders children only when the current session role is in
 * `roles`, otherwise redirects. Replaces ad-hoc in-component admin gating.
 */
export const RequireRole: React.FC<RequireRoleProps> = ( { roles, children, redirectTo = "/" } ) => {
    const role = useAppSelector( selectUserRole );

    if ( !role || !roles.includes( role ) ) {
        return <Navigate to={ redirectTo } replace/>;
    }
    return <>{ children }</>;
};
