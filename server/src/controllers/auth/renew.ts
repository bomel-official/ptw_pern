import { JWTUserData, UserRepository } from "@core";
import { ApiError } from "@error";
import { getEnv } from "@libs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { genJwt } from "../libs";

export async function renew( req: Request, res: Response, next: NextFunction ) {
    if ( !req.headers.authorization ) {
        return next(
            ApiError.badRequest( "Нет заголовка авторизации в запросе" ) );
    }

    const reqToken = req.headers.authorization.split( " " )[1];
    if ( !reqToken ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    const userId = (jwt.verify( reqToken,
        getEnv( process.env.JWT_SECRET_KEY ) ) as JWTUserData).id;
    const user = await UserRepository.findByPk( userId );
    if ( !user ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    const token = genJwt( {
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: user.nickname
    } );

    return res.json( { token } );
}
