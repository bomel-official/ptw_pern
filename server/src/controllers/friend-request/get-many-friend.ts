import { User } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function getManyFriend( req: Request, res: Response,
                                     next: NextFunction ) {
    const { id } = req.params;
    const user = await User.findByPk( id );

    if ( !user ) {
        return next(
            ApiError.badRequest( "Пользователь не найден" ) );
    }

    const { count, rows: friends } = await User.findAndCountAll( {
        where: {
            id: user.friends
        }
    } );
    return res.json( {
        message: `Друзей найдено: ${ count }`,
        friends
    } );
}
