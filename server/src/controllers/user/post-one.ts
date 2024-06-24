import { UserRepository } from "@core";
import { ApiError } from "@error";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { genJwt } from "../libs";

export async function postOne( req: Request, res: Response, next: NextFunction ) {
    const { email, password, repeatPassword, nickname } = req.body;
    if ( !nickname ) {
        return next( ApiError.badRequest( "Поле никнейм не заполнено" ) );
    }
    if ( password.length < 4 ) {
        return next( ApiError.badRequest( "Длина пароля меньше 4 символов" ) );
    }
    if ( nickname.length < 4 ) {
        return next(
            ApiError.badRequest( "Длина никнейма меньше 4 символов" ) );
    }
    if ( !nickname.match( /^[0-9A-Z]{4,}$/i ) ) {
        return next(
            ApiError.badRequest( "Поле никнейм имеет недопустимые символы" ) );
    }
    if ( !email.match( /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i ) ) {
        return next( ApiError.badRequest( "Некоректный email" ) );
    }

    const emailCandidate = await UserRepository.findOne( {
        where: { email: email.trim() },
        attributes: [ "id" ]
    } );
    if ( emailCandidate ) {
        return next(
            ApiError.badRequest(
                "Пользователь с таким email уже существует" ) );
    }

    const nicknameCandidate = await UserRepository.findOne( {
        where: { nickname: nickname.trim() },
        attributes: [ "id" ]
    } );
    if ( nicknameCandidate ) {
        return next( ApiError.badRequest( "Пользователь с таким никнеймом уже существует" ) );
    }

    if ( password !== repeatPassword ) {
        return next( ApiError.badRequest( "Пароли не совпадают" ) );
    }

    const hashPassword = await bcrypt.hash( password, 5 );
    const newUser = await UserRepository.create( {
        email: email.trim(),
        password: hashPassword,
        nickname: nickname.trim()
    } );
    await newUser.save();
    const token = genJwt( {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        nickname: newUser.nickname
    } );

    return res.json( { token } );
}
