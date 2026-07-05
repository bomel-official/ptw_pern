import { authRouter } from "@modules/auth";
import { competitionRouter } from "@modules/competition";
import { friendsRouter } from "@modules/friend";
import { questionRouter } from "@modules/question";
import { teamRouter } from "@modules/team";
import { tournamentRouter } from "@modules/tournament";
import { userRouter } from "@modules/user";
import express from "express";
import { buildRouter } from "./build";

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
