import { isError, TournamentRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { postOneValidate } from "./post-one-validate";

export async function postOne( req: Request, res: Response, next: NextFunction ) {
    const validated = await postOneValidate( req );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const validatedData = validated.data;

    const slugTournament = await TournamentRepository.findOne( {
        where: { slug: validatedData.slug }
    } );
    if ( slugTournament ) {
        return next(
            ApiError.badRequest(
                "Турнир с такой ссылкой уже существует" ) );
    }

    const newTournament = await TournamentRepository.create( validatedData );

    return res.json( { message: "Турнир создан!", item: newTournament } );
}
