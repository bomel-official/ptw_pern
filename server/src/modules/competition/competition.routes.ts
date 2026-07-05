import { authMiddleware, userMiddleware } from "@middleware";
import { Router } from "express";
import { competitionController } from "./competition.controller";

const competitionRouter = Router();

competitionRouter.get( "/", competitionController.getOne );
competitionRouter.get( "/many", userMiddleware, competitionController.getMany );

competitionRouter.post( "/", authMiddleware, competitionController.upsert );
competitionRouter.post( "/table", authMiddleware, competitionController.upsertTable );

export { competitionRouter };
