import express from "express";
import { authRouter } from "./auth";
import { buildRouter } from "./build";
import { friendsRouter } from "./friends";
import { questionRouter } from "./question";
import { teamRouter } from "./team";
import { tournamentRouter } from "./tournament";
import { userRouter } from "./user";

const router = express.Router();

router.use( "/user", userRouter );
router.use( "/auth", authRouter );
router.use( "/build", buildRouter );
router.use( "/team", teamRouter );
router.use( "/tournament", tournamentRouter );
router.use( "/friend", friendsRouter );
router.use( "/question", questionRouter );

export { router };
