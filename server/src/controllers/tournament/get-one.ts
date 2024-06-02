import { Tournament, User } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOne( req: Request, res: Response,
                              next: NextFunction ) {
    const { slug } = req.params;
    const tournament = await Tournament.findOne( {
        where: { slug },
        include: [ {
            model: User,
            as: "players",
            attributes: [ "id" ]
        } ]
    } );
    return res.json( { tournament } );
}
