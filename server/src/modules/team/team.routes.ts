import { authMiddleware } from "@middleware";
import { Router } from "express";
import { teamController } from "./team.controller";

const teamRouter = Router();

teamRouter.get( "/search", teamController.search );
teamRouter.post( "/save-create", authMiddleware, teamController.save );
// POST kept to match the current client contract (logical DELETE)
teamRouter.post( "/delete-leave", authMiddleware, teamController.deleteOrLeave );

export { teamRouter };
