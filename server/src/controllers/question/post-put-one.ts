import { CV, generateValidator, isError, QuestionRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function postPutOne( req: Request, res: Response,
                                  next: NextFunction ) {
    const validated = generateValidator( () => ({
        id: new CV( req.body.id, { label: "id" } ).optional().number().val,
        question_EU: new CV( req.body.question_EU,
            { label: "question_EU" } ).string().val,
        question_RU: new CV( req.body.question_RU,
            { label: "question_RU" } ).string().val,
        answer_RU: new CV( req.body.answer_RU,
            { label: "answer_RU" } ).string().val,
        answer_EU: new CV( req.body.answer_EU,
            { label: "answer_EU" } ).string().val,
    }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const {
        id, question_RU, question_EU, answer_RU, answer_EU
    } = validated.data;

    if ( id ) { // Edit
        const item = await QuestionRepository.findByPk( id );
        if ( !item ) {
            return next( ApiError.badRequest( "Запись не найдена" ) );
        }

        item.set( {
            question_EU,
            question_RU,
            answer_EU,
            answer_RU
        } );
        await item.save();

        res.json( { message: "Вопрос обновлён!" } );
    } else { // Create
        const newItem = await QuestionRepository.create( {
            question_RU,
            question_EU,
            answer_RU,
            answer_EU
        } );
        res.json( { message: "Вопрос добавлен!", item: newItem } );
    }
}
