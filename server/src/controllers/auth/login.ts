import { UserRepository } from "@core";
import { ApiError } from "@error";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { genJwt } from "../libs";

export async function login( req: Request, res: Response, next: NextFunction ) {
    const { email, password } = req.body;
    const nicknameUser = await UserRepository.findOne( {
        where: { nickname: email },
        attributes: [ "email", "password", "id", "role", "nickname" ]
    } );
    const emailUser = await UserRepository.findOne( {
        where: { email },
        attributes: [ "email", "password", "id", "role", "nickname" ]
    } );

    const user = nicknameUser || emailUser;
    if ( !user ) {
        return next( ApiError.badRequest( "Пользователь не найден" ) );
    }

    const comparePassword = bcrypt.compareSync( password, user.password );
    if ( !comparePassword ) {
        return next( ApiError.badRequest( "Неверный пароль" ) );
    }

    const token = genJwt( {
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: user.nickname
    } );
    return res.json( { token } );
}
