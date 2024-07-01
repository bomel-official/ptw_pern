import { CompetitionRepository, CV, generateValidator, isError, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { normalizeCompetition } from "../../core/libs/normalize-competition";

export async function getOne( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            id: new CV( req.query.id, { label: "id" } ).number().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { id } = validated.data;

    const competition = await CompetitionRepository.findByPk( id, {
        include: [ {
            model: UserRepository,
            as: "users"
        } ]
    } );

    return res.json( { data: normalizeCompetition( competition ) } );
}
