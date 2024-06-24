import { ParticipantRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { getParticipantRoomNumber } from "../libs/get-participant-room-number";

export async function putOneRoomNumber( req: Request, res: Response, next: NextFunction ) {
    const { participantId } = req.body;
    const participant = await ParticipantRepository.findByPk( participantId );
    if ( !participant ) {
        return next( ApiError.badRequest( "Участник не найден" ) );
    }

    // Calculate roomNumber
    participant.roomNumber = await getParticipantRoomNumber(
        participant.tournamentId );
    await participant.save();

    return res.json( { isOk: true } );
}
