import { TournamentRepository, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOne( req: Request, res: Response, next: NextFunction ) {
    const { slug } = req.params;
    const tournament = await TournamentRepository.findOne( {
        where: { slug },
        include: [ {
            model: UserRepository,
            as: "players",
            attributes: [ "id" ]
        } ]
    } );
    return res.json( { tournament } );
}
