import { JWTUserData, UserRepository } from "@core";
import { ApiError } from "@error";
import { getJwtSecret } from "@libs";
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

    let userId: number;
    try {
        userId = (jwt.verify( reqToken, getJwtSecret() ) as JWTUserData).id;
    } catch ( e ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }
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
