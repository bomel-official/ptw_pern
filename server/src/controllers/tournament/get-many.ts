import { Tournament, User } from "@core";
import { NextFunction, Request, Response } from "express";
import { Op, Sequelize, WhereOptions } from "sequelize";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const { status, numberPosts, game, type, userId } = req.query;

    let whereDateEnd: WhereOptions = {};
    let orderType: [ string, "DESC" | "ASC" ][] = [ [ "dateBegin",
        "DESC" ], [ "id", "DESC" ] ];

    if ( status === "active" ) {
        whereDateEnd = {
            dateEnd: { [Op.gte]: Sequelize.literal( "NOW()" ) },
        };
        orderType = [ [ "dateBegin", "ASC" ], [ "id", "DESC" ] ];
    } else if ( status === "finished" ) {
        whereDateEnd = {
            dateEnd: { [Op.lte]: Sequelize.literal( "NOW()" ) },
        };
    }

    let includeUser = {
        model: User,
        as: "players",
        attributes: [ "id" ],
        where: {}
    };
    if ( userId ) {
        includeUser.where = {
            id: userId
        };
    }

    const rows = await Tournament.findAll( {
        where: {
            [Op.and]: [
                whereDateEnd,
                { game },
                type ? { type } : {}
            ]
        },
        order: orderType,
        include: [ includeUser ],
        limit: typeof numberPosts === "string" && numberPosts !== "-1" ?
            parseInt( numberPosts ) : -1,
    } );
    return res.json( {
        tournaments: rows
    } );
}
