import { CV, generateValidator, isError, TeamRepository, TeamRequestRepository, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            type: new CV( req.query.type,
                { label: "type" } ).optional().string().val,
            userId: new CV( req.query.userId,
                { label: "userId" } ).optional().number().val,
            s: new CV( req.query.s,
                { label: "s" } ).optional().string().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const {
        type, userId, s
    } = validated.data;

    const teamIds: number[] = [];

    if ( userId && type === "part" ) {
        const teamReqs = await TeamRequestRepository.findAll( { where: { userId } } );
        for ( const item of teamReqs ) {
            teamIds.push( item.teamId );
        }
    }

    const rows = await TeamRepository.findAll( {
        where: {
            ...(userId && type === "own" ? { capitanId: userId } : {}),
            ...(userId && type === "part" ? { id: teamIds } : {}),
            ...(typeof s === "string" ? {
                name: {
                    [Op.iLike]: `%${ s }%`
                }
            } : {})
        },
        include: [
            {
                model: UserRepository,
                association: "players",
                isMultiAssociation: true,
                as: "players",
            },
            {
                model: UserRepository,
                as: "capitan",
                foreignKey: "capitanId",
                isMultiAssociation: true,
            },
        ],
        ...(typeof s === "string" ? {
            limit: 10
        } : {})
    } );
    res.json( { rows } );
}
