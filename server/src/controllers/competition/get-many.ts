import {
    CompetitionRepository,
    CompetitionTableRepository,
    CV,
    generateValidator,
    isError,
    UserRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            type: new CV( req.query.type, { label: "type" } ).optional().string().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const type = validated.data.type ?? "all";

    if ( type === "all" ) {
        const items = await CompetitionRepository.findAll( {
            limit: 20
        } );
        return res.json( { data: items } );
    }
    if ( type === "own" ) {
        if ( !req.user || !req.user.id ) {
            return next( ApiError.unauthorized() );
        }

        const user = await UserRepository.findOne( {
            where: {
                id: req.user.id
            },
            include: [
                {
                    model: CompetitionRepository,
                    as: "competitions",
                    foreignKey: "authorId"
                }
            ]
        } );

        if ( !user ) {
            return next( ApiError.unauthorized() );
        }

        return res.json( { data: user.competitions } );
    }
    if ( type === "own-included" ) {
        if ( !req.user || !req.user.id ) {
            return next( ApiError.unauthorized() );
        }

        const competition = await CompetitionRepository.findAll( {
            include: [
                {
                    model: CompetitionTableRepository,
                    as: "competitionIncluded",
                    include: [ {
                        model: UserRepository,
                        as: "users",
                        where: {
                            id: req.user.id
                        },
                        attributes: []
                    } ]
                }
            ]
        } );

        return res.json( { data: competition } );
    }

    return next( ApiError.badRequest( "Некорректный запрос" ) );
}
