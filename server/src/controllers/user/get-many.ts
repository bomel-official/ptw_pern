import { UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getMany( req: Request, res: Response, next: NextFunction ) {
    const { s, friendOf } = req.query;

    const capitan = (friendOf && typeof friendOf === "string" && friendOf !== 'null') ? await UserRepository.findByPk( friendOf ) : null;
    const { count, rows } = await UserRepository.findAndCountAll( {
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            nickname: {
                                [Op.iLike]: `%${ s }%`
                            }
                        },
                        {
                            activisionId: {
                                [Op.iLike]: `%${ s }%`
                            }
                        }
                    ]
                },
                capitan ? {
                    id: {
                        [Op.in]: capitan.friends
                    }
                } : {}
            ]
        },
        limit: 10
    } );
    return res.json( {
        message: `Пользователей найдено: ${ count }`,
        rows
    } );
}
