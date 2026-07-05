import { competitionRouter } from "@modules/competition";
import { friendsRouter } from "@modules/friend";
import { questionRouter } from "@modules/question";
import { teamRouter } from "@modules/team";
import { tournamentRouter } from "@modules/tournament";
import express from "express";
import { authRouter } from "./auth";
import { buildRouter } from "./build";
import { userRouter } from "./user";

const router = express.Router();

router.use( "/user", userRouter );
router.use( "/auth", authRouter );
router.use( "/build", buildRouter );
router.use( "/team", teamRouter );
router.use( "/tournament", tournamentRouter );
router.use( "/friend", friendsRouter );
router.use( "/question", questionRouter );
router.use( "/competition", competitionRouter );

export { router };
