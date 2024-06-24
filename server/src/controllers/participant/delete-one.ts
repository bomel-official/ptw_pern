import {
    CV,
    generateValidator,
    isError,
    Participant,
    ParticipantRepository,
    ParticipantUserRepository,
    TournamentRepository,
    UserRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { isAdmin } from "../libs";

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            participantId: new CV( req.body.participantId,
                { label: "participantId" } ).number().val,
            tournamentId: new CV( req.body.tournamentId,
                { label: "tournamentId" } ).number().val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { participantId, tournamentId } = validated.data;

    if ( !req.user || !req.user.id ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }

    let participant: Participant | null;
    if ( participantId ) {
        participant = await ParticipantRepository.findOne( {
            where: {
                id: participantId
            },
            include: [ { model: UserRepository } ]
        } );
    } else {
        participant = await ParticipantRepository.findOne( {
            where: {
                tournamentId
            },
            include: [
                {
                    model: UserRepository,
                    as: "users",
                    where: {
                        id: req.user.id,
                    }
                }
            ]
        } );
    }
    if ( !participant ) {
        return next( ApiError.forbidden( "Ошибка сервера..." ) );
    }
    const participantUsers = await ParticipantUserRepository.findAll( {
        where: {
            participantId: participant.id
        }
    } );
    const participantPlayerIds = participantUsers.map(
        participantUser => (participantUser.userId) );

    const tournament = await TournamentRepository.findByPk( participant.tournamentId );
    if ( !tournament ) {
        return next( ApiError.forbidden( "Ошибка сервера..." ) );
    }

    if ( !participantPlayerIds.includes( req.user.id ) &&
        !isAdmin( req.user ) ) {
        return next( ApiError.forbidden( "Нет доступа" ) );
    }
    for ( const user of participant.users ) {
        await tournament.$remove( "player", user );
    }
    await participant.destroy();
    return res.json( { isOk: true, message: "Удалено!" } );
}
