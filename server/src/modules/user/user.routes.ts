import { UserRoleGroup } from "@constants";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { authController } from "@modules/auth";
import { Router } from "express";
import { userController } from "./user.controller";

const userRouter = Router();

// Auth (deprecated password flow — kept for compatibility)
userRouter.post( "/login", createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), authController.login );
userRouter.post( "/renew", authController.renew );
userRouter.get( "/auth", authMiddleware, authController.check );

// [GET]
userRouter.get( "/admin/get-admins",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), userController.getManyAdmins );
userRouter.get( "/", userController.getMany );
userRouter.get( "/:id", userController.getOne );
userRouter.get( "/nickname/:nickname", userController.getOneByNickname );

// [POST]
userRouter.post( "/register",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), userController.create );

// [PUT] (POST kept to match the current client contract)
userRouter.post( "/admin/set-role",
    createCheckRoleMiddleware( UserRoleGroup.SUPERADMIN ), userController.updateRole );
userRouter.post( "/edit", authMiddleware, userController.update );

export { userRouter };
