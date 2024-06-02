import { getEnv } from "@libs";
import type { NextFunction, Request, Response } from "express";

export async function redirectDiscord( req: Request, res: Response,
                                       next: NextFunction ) {
    const url = getEnv( process.env.DISCORD_AUTH_URL );
    res.redirect( url );
}
