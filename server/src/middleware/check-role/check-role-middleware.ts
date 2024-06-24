import { UserRole } from "@constants";
import { JWTUserData, UserRepository } from "@core";
import { getEnv, jwtUserData } from "@libs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function createCheckRoleMiddleware( roles: UserRole[] ) {
    return async function ( req: Request, res: Response, next: NextFunction ) {
        if ( req.method === "OPTIONS" ) {
            return next();
        }
        if ( req.headers.authorization ) {
            const token = req.headers.authorization.split( " " )[1];
            if ( !token ) {
                return res.status( 401 ).json( { message: "Не авторизован" } );
            }
            const decoded = jwt.verify( token,
                getEnv( getEnv( process.env.JWT_SECRET_KEY ) ) ) as JWTUserData;
            const user = await UserRepository.findByPk( decoded.id );

            if ( !user || roles.indexOf( user.role ) === -1 ) {
                return res.status( 403 ).json( { message: "Нет доступа" } );
            }
            req.user = jwtUserData( user );
            return next();
        }

        return res.status( 401 ).json( { message: "Не авторизован" } );
    };
}
