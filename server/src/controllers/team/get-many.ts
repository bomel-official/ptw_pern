import { TeamRepository, TeamRequestRepository, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { WhereOptions } from "sequelize";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const { type, userId } = req.query;
    let where: WhereOptions = {};

    if ( userId && type === "own" ) {
        where = {
            capitanId: userId
        };
    }

    if ( userId && typeof userId === "string" && type === "part" ) {
        const teamReqs = await TeamRequestRepository.findAll( { where: { userId } } );
        const teamIds: number[] = [];
        for ( const item of teamReqs ) {
            teamIds.push( item.teamId );
        }
        where = {
            id: teamIds
        };
    }
    const rows = await TeamRepository.findAll( {
        where,
        include: [
            {
                model: UserRepository,
                association: "players",
                as: "players",
            },
            {
                model: UserRepository,
                as: "capitan",
                foreignKey: "capitanId"
            },
        ]
    } );
    res.json( { rows } );
}
