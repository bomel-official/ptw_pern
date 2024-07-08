import { CompetitionTableRepository, TeamRepository, TournamentRepository, UserRepository } from "@core";
import { NextFunction, Request, Response } from "express";
import { normalizeTournament } from "../../core/libs/normalize-tournament";

export async function getOne( req: Request, res: Response, next: NextFunction ) {
    const { slug } = req.params;
    const tournament = await TournamentRepository.findOne( {
        where: { slug },
        include: [ {
            model: UserRepository,
            as: "players",
            attributes: [ "id" ]
        }, {
            model: CompetitionTableRepository,
            as: "competitionTable",
            include: [ {
                model: TeamRepository,
                as: "teams"
            } ]
        } ]
    } );
    return res.json( { tournament: normalizeTournament( tournament ) } );
}
