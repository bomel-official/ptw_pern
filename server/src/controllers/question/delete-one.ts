import { QuestionRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    const { id } = req.body;

    const item = await QuestionRepository.findByPk( id );
    if ( !item ) {
        return next( ApiError.badRequest( "Запись не найдена" ) );
    }

    await item.destroy();
    res.json( { message: "Вопрос удалён!" } );
}
