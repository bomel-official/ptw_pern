import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.get( "/discord", authController.redirectDiscord );
authRouter.get( "/discord-redirect", authController.redirectDiscordProceed );
authRouter.get( "/get-user-by-cookie", authController.getUserByCookie );

export { authRouter };
