import { UserRoleGroup } from "@constants";
import {
    check,
    getManyUser,
    getManyUserAdmins,
    getOneUser,
    getOneUserByNickname,
    login,
    postOneUser,
    putOneUser,
    putOneUserRole,
    renew
} from "@controllers";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";

const userRouter = Router();

// Auth (Deprecated)

userRouter.post( "/login",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), login );
userRouter.post( "/renew", renew );
userRouter.get( "/auth", authMiddleware, check );

// [GET]

userRouter.get( "/admin/get-admins",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), getManyUserAdmins );
userRouter.get( "/", getManyUser );
userRouter.get( "/:id", getOneUser );
userRouter.get( "/nickname/:nickname", getOneUserByNickname );

// [POST]

userRouter.post( "/register",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), postOneUser );

// [PUT]

userRouter.post( "/admin/set-role",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), putOneUserRole );
userRouter.post( "/edit", authMiddleware, putOneUser );
userRouter.post( "/lostpassoword" ); // todo

export { userRouter };
