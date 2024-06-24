import { ParticipantRepository } from "@core";
import { NextFunction, Request, Response } from "express";

export async function putOneIncreasePriority( req: Request, res: Response,
                                              next: NextFunction ) {
    const { participantId } = req.body;

    const participant = await ParticipantRepository.findByPk( participantId );
    if ( participant ) {
        participant.priority += 1;
        await participant.save();
    }

    return res.json( { isOk: true, message: "Данные обновлены!" } );
}
