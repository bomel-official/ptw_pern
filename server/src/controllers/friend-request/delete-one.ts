import { FriendRequest, User } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function deleteOne( req: Request, res: Response,
                                 next: NextFunction ) {
    if ( !req.user || !req.user.id ) {
        return next(
            ApiError.unauthorized( "Не авторизован" ) );
    }

    const { to } = req.body;
    const from = req.user.id;

    const toUser = await User.findByPk( to );
    const fromUser = await User.findByPk( from );

    if ( !toUser || !fromUser ) {
        return next(
            ApiError.badRequest( "Пользователь не найден" ) );
    }

    await toUser.update( {
        friends: toUser.friends.filter( ( friendId ) => friendId !== from )
    } );
    await fromUser.update( {
        friends: fromUser.friends.filter( ( friendId ) => friendId !== to )
    } );
    await FriendRequest.destroy( {
        where: {
            [Op.or]: [
                { userFromId: from, userToId: to },
                { userFromId: to, userToId: from },
            ],
        },
    } );

    return res.json( { message: "Пользователь успешно удалён из друзей" } );
}
