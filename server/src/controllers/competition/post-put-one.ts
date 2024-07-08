import { CompetitionRepository, CV, generateValidator, isError } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function postPutOne( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            id: new CV( req.body.id, { label: "id" } ).optional().number().val,
            title: new CV( req.body.title, { label: "title" } ).string().val,
            participantsAmount: new CV( req.body.participantsAmount, { label: "participantsAmount" } ).number().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { id, title, participantsAmount } = validated.data;

    if ( id ) { // Edit
        const competition = await CompetitionRepository.findByPk( id );
        if ( !competition ) {
            return next( ApiError.badRequest( "Запись не найдена" ) );
        }
        if ( !req.user || !req.user.id || req.user.id !== competition.authorId ) {
            return next( ApiError.forbidden( "Нет доступа" ) );
        }

        competition.title = title;
        competition.participantsAmount = participantsAmount;
        await competition.save();

        return res.json( { data: competition } );
    } else { // Create
        if ( !req.user || !req.user.id ) {
            return next( ApiError.unauthorized() );
        }
        const competition = await CompetitionRepository.create( {
            title,
            participantsAmount,
            authorId: req.user.id
        } );

        return res.json( { data: competition } );
    }

    return next( ApiError.badRequest( "Некорректный запрос" ) );
}
