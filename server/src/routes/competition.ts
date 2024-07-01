import { getManyCompetition, getOneCompetition, postPutOneCompetition } from "@controllers";
import { authMiddleware, userMiddleware } from "@middleware";
import { Router } from "express";

const competitionRouter = Router();

// [GET]

competitionRouter.get( "/", getOneCompetition );
competitionRouter.get( "/many", userMiddleware, getManyCompetition );

// [POST]

competitionRouter.post( "/", authMiddleware, postPutOneCompetition );

// [DELETE]

export { competitionRouter };
