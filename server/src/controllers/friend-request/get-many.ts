import { FriendRequest, User } from "@core";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export async function getMany( req: Request, res: Response,
                               next: NextFunction ) {
    const { id } = req.params;

    const { count, rows: requests } = await FriendRequest.findAndCountAll( {
        where: {
            [Op.and]: [
                {
                    userToId: id
                },
                {
                    isAccepted: false
                },
            ]
        },
        include: { model: User, as: "user_from" }
    } );
    return res.json( {
        message: `Заявок найдено: ${ count }`,
        requests
    } );
}
