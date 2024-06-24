import { getUserByCookie, redirectDiscord, redirectDiscordProceed } from "@controllers";
import { Router } from "express";

const authRouter = Router();

// [GET]

authRouter.get( "/discord", redirectDiscord );
authRouter.get( "/discord-redirect", redirectDiscordProceed );
authRouter.get( "/get-user-by-cookie", getUserByCookie );

export { authRouter };
