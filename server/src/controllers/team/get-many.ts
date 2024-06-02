import { Team, TeamRequest, User } from "@core";
import { NextFunction, Request, Response } from "express";
import { WhereOptions } from "sequelize";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const { type, userId } = req.query;
    let where: WhereOptions = {};

    if ( userId && type === "own" ) {
        where = {
            userId: userId
        };
    }

    if ( userId && typeof userId === 'string' && type === "part" ) {
        const teamReqs = await TeamRequest.findAll( { where: { userId } as WhereOptions } );
        const teamIds: number[] = [];
        for ( const item of teamReqs ) {
            teamIds.push( item.teamId );
        }
        where = {
            id: teamIds
        };
    }
    const rows = await Team.findAll( {
        where,
        include: [
            {
                model: User,
                as: "players"
            },
            {
                model: User,
                association: "capitan"
            },
        ]
    } );
    res.json( { rows } );
}
