import { TournamentRepository, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { IncludeOptions } from "sequelize/types/model";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const { status, numberPosts, game, type, userId } = req.query;
    let whereDateEndObject: WhereOptions = {};
    let orderType: [ string, "DESC" | "ASC" ][] = [
        [ "dateBegin", "DESC" ],
        [ "id", "DESC" ],
    ];
    if ( status === "active" ) {
        whereDateEndObject = {
            dateEnd: {
                [Op.gte]: Sequelize.literal( "NOW()" ),
            },
        };
        orderType = [
            [ "dateBegin", "ASC" ],
            [ "id", "DESC" ],
        ];
    } else if ( status === "finished" ) {
        whereDateEndObject = {
            dateEnd: {
                [Op.lte]: Sequelize.literal( "NOW()" ),
            },
        };
    }

    let includeUser: IncludeOptions = {
        model: UserRepository,
        as: "players",
        attributes: [ "id" ],
    };
    if ( userId ) {
        includeUser = {
            ...includeUser, where: {
                id: userId
            }
        };
    }

    const rows = await TournamentRepository.findAll( {
        where: {
            [Op.and]: [
                whereDateEndObject,
                {
                    game: game
                },
                type ? {
                    type: type
                } : {}
            ]
        },
        order: orderType,
        include: [ includeUser ],
        ...(typeof numberPosts === "string" && numberPosts !== "-1" ? { limit: parseInt( numberPosts ) } : {})
    } );
    return res.json( {
        tournaments: rows
    } );
}
