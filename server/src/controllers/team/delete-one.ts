import { TeamRepository, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    const { teamId, userId } = req.body;

    const team = await TeamRepository.findByPk( teamId );
    if ( !team ) {
        return next( ApiError.badRequest( "Команда не найдена" ) );
    }

    if ( userId === team.capitanId ) {
        await team.destroy();
        res.json( { message: "Команда успешно удалена!", isOk: true } );
    } else {
        const user = await UserRepository.findByPk( userId );
        if ( !user ) {
            return next( ApiError.badRequest( "Ошибка сервера: пользователь не найден" ) );
        }
        await team.removePlayer( user );
        res.json( { message: "Вы успешно покинули комаду!", isOk: true } );
    }
}
