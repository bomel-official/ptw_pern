import { User } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function putOneRole( req: Request, res: Response,
                                  next: NextFunction ) {
    const { userId, role } = req.body;

    const user = await User.findByPk( userId );
    if ( !user ) {
        return next( ApiError.badRequest( "Пользователь не найден" ) );
    }

    user.role = role;
    await user.save();

    return res.json( { message: "Успех!" } );
}
