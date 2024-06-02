import { JWTUserData } from "@core";
import { getEnv } from "@libs";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = getEnv( getEnv(process.env.JWT_SECRET_KEY) ) ?? "JWT_SECRET_KEY";

export function authMiddleware( req: Request, res: Response,
                                next: NextFunction ) {
    if ( req.method === "OPTIONS" ) {
        next();
    }

    if ( req.headers.authorization ) {
        const token = req.headers.authorization.split( " " )[1];
        if ( !token ) {
            return res.status( 401 ).json( { message: "Не авторизован" } );
        }
        req.user = jwt.verify( token, JWT_SECRET_KEY ) as JWTUserData;
        next();
    }

    res.status( 401 ).json( { message: "Не авторизован" } );
}
