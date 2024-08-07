import { ParticipantRepository, ParticipantRequestRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function putOneStatus( req: Request, res: Response, next: NextFunction ) {
    const { participantRequestId, status } = req.body;

    const participantRequest = await ParticipantRequestRepository.findByPk( participantRequestId );
    if ( !participantRequest ) {
        return res.json( { isOk: false } );
    }

    const participant = await ParticipantRepository.findByPk(
        participantRequest.participantId );
    if ( !participant ) {
        return res.json( { isOk: false } );
    }

    if ( status === "approved" ) {
        participant.set( {
            dataArray: participantRequest.dataArray
        } );
        await participant.save();
    }
    if ( status === "discarded" ) {
        await participantRequest.destroy();
    }
    return res.json( { isOk: true } );
}
