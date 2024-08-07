import { CV, FriendRequestRepository, generateValidator, isError, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { areFriends } from "../libs";

export async function postOne( req: Request, res: Response,
                               next: NextFunction ) {
    if ( !req.user || !req.user.id ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    const from = req.user.id;

    const validated = generateValidator(
        () => ({
            to: new CV( req.body.to, { label: "to" } ).number().val
        }) );
    if ( isError( validated ) ) {
        return next(validated.errorObject);
    }
    const { to } = validated.data;

    const recipient = await UserRepository.findByPk( to );
    const sender = await UserRepository.findByPk( from );

    if ( !sender || !recipient ) {
        return next( ApiError.badRequest( "Пользователь не найден" ) );
    }

    if ( areFriends( recipient, sender ) ) {
        return res.json( { message: "Пользователь является вашим другом" } );
    }

    const existingRequest = await FriendRequestRepository.findOne( {
        where: { userToId: to, userFromId: from }
    } );

    if ( existingRequest ) {
        return res.json( { message: "Заявка отправлена!" } );
    }

    const oppositeRequest = await FriendRequestRepository.findOne( {
        where: { userToId: from, userFromId: to }
    } );

    if ( oppositeRequest ) {
        await recipient.update(
            { friends: [ ...recipient.friends, sender.id ] } );
        await sender.update( { friends: [ ...sender.friends, recipient.id ] } );
        await oppositeRequest.update( { isAccepted: true } );
        return res.json( { message: "Пользователь добавлен в друзья!" } );
    } else {
        await FriendRequestRepository.create( {
            userToId: to,
            userFromId: from,
            isAccepted: false
        } );
        return res.json( { message: "Заявка отправлена!" } );
    }
}
