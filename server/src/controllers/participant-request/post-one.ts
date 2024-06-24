import { AMOUNT_ROUNDS } from "@constants";
import {
    ParticipantRepository,
    ParticipantRequestRepository,
    TournamentRepository,
    UserRepository
} from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { postOneValidate } from "./post-one-validate";

export async function postOne( req: Request, res: Response, next: NextFunction ) {
    const validated = await postOneValidate( req );
    if ( validated instanceof Error ) {
        return next( validated );
    }
    const { participantId, dataArray, places, reqUser, filename } = validated;

    const participant = await ParticipantRepository.findByPk( participantId, {
        include: [ {
            model: UserRepository, as: "users"
        } ]
    } );

    if ( !participant ||
        !participant.users.find( ( user ) => user.id === reqUser.id ) ) {
        return next( ApiError.badRequest( "Некорректный запрос" ) );
    }

    const tournament = await TournamentRepository.findByPk( participant.tournamentId );
    if ( !tournament ) {
        return next( ApiError.badRequest( "Турнир не найден" ) );
    }

    for ( let j = 0; j < AMOUNT_ROUNDS; j++ ) {
        for ( let i = 0; i < tournament.playersInTeam; i++ ) {
            if ( typeof dataArray[i][j] !== "number" ) {
                return next( ApiError.badRequest(
                    "Некорректно заполнена таблица убийств" ) );
            }
        }
        if ( places[j].length !== 2 || typeof places[j][0] !== "number" ||
            typeof places[j][1] !== "number" ) {
            return next( ApiError.badRequest( "Некорректно заполнены места" ) );
        }
    }
    const newParticipantRequest = await ParticipantRequestRepository.create( {
        dataArray,
        places,
        approveUrl: filename,
        participantId
    } );

    participant.set( {
        dataArray: newParticipantRequest.dataArray
    } );
    await participant.save();

    return res.json( { participantRequest: newParticipantRequest } );
}
