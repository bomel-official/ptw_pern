import { JWTUserData } from "@core";
import { getJwtSecret } from "@libs";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function userMiddleware( req: Request, res: Response,
                                next: NextFunction ) {
    if ( req.method === "OPTIONS" ) {
        return next();
    }

    if ( req.headers.authorization ) {
        const token = req.headers.authorization.split( " " )[1];
        if ( token ) {
            try {
                req.user = jwt.verify( token, getJwtSecret() ) as JWTUserData;
            } catch ( e ) {}
        }
    }

    return next();
}
