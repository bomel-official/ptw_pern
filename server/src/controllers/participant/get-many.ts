import {
    CV,
    generateValidator,
    isError,
    Participant,
    ParticipantRequest,
    Team,
    User
} from "@core";
import { NextFunction, Request, Response } from "express";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            tournamentId: new CV( req.query.tournamentId,
                { label: "tournamentId" } ).number().val,
            type: new CV( req.query.type, { label: "type" } ).optional()
                .string().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { tournamentId, type } = validated.data;

    const participants = await Participant.findAll( {
        where: {
            tournamentId: tournamentId
        },
        order: (!type || type === "users") ? [
            [ "roomNumber", "ASC" ],
            [ "id", "ASC" ],
            [ { model: User, as: "users" }, "id", "ASC" ],
        ] : [
            [ "points", "DESC" ],
            [ "priority", "DESC" ],
            [ "id", "ASC" ],
            [ { model: User, as: "users" }, "id", "ASC" ],
        ],
        include: [
            { model: User, as: "users" },
            { model: Team },
            { model: ParticipantRequest },
        ]
    } );

    return res.json( { participants } );
}
