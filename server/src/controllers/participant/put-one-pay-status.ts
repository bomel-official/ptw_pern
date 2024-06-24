import { ParticipantRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";

export async function putOnePayStatus( req: Request, res: Response,
                                       next: NextFunction ) {
    const { participantId } = req.body;
    const participant = await ParticipantRepository.findByPk( participantId );
    if ( !participant ) {
        return next( ApiError.badRequest( "Участник не найден" ) );
    }
    participant.isPaid = !participant.isPaid;
    await participant.save();
    return res.json( { message: "Статус оплаты изменён!", isOk: true } );
}
