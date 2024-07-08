import { getManyCompetition, getOneCompetition, postPutOneCompetition, postPutOneCompetitionTable } from "@controllers";
import { authMiddleware, userMiddleware } from "@middleware";
import { Router } from "express";

const competitionRouter = Router();

// [GET]

competitionRouter.get( "/", getOneCompetition );
competitionRouter.get( "/many", userMiddleware, getManyCompetition );

// [POST]

competitionRouter.post( "/", authMiddleware, postPutOneCompetition );
competitionRouter.post( "/table", authMiddleware, postPutOneCompetitionTable );

// [DELETE]

export { competitionRouter };
