import { yookassaCreateInvoice, yookassaGetStatus } from "@controllers";
import {
    CV,
    generateValidator,
    InvoiceRepository,
    isError,
    ParticipantRepository,
    ParticipantUserRepository,
    TeamRepository,
    TournamentRepository,
    UserRepository
} from "@core";
import { NextFunction, Request, Response } from "express";

export async function getOneOwnParticipant( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            tournamentId: new CV( req.query.tournamentId,
                { label: "tournamentId" } ).number().val,
            userId: new CV( req.query.userId, { label: "userId" } ).number().val
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { tournamentId, userId } = validated.data;

    const participant = await ParticipantRepository.findOne( {
        where: {
            tournamentId
        },
        include: [
            {
                model: UserRepository,
                as: "users",
                where: { id: userId }
            },
            {
                model: TeamRepository,
                as: "team",
                include: [ { model: UserRepository, as: "players" } ]
            },
            { model: InvoiceRepository }
        ]
    } );
    if ( !participant ) {
        return res.json( { participant: null, participantUsers: [] } );
    }
    const tournament = await TournamentRepository.findByPk( participant.tournamentId );
    if ( !tournament ) {
        return res.json( { participant: null, participantUsers: [] } );
    }

    if ( tournament.participationPrice && !participant.isPaid ) {
        const isPaid = await yookassaGetStatus( participant.id );
        if ( isPaid ) {
            participant.isPaid = isPaid;
            await participant.save();
        }

        if ( participant.invoice && participant.invoice.expired ) {
            const invoiceExpired = new Date( participant.invoice.expired ).getTime();
            const now = new Date().getTime();

            if ( (invoiceExpired - 86400000) < now ) {
                const updatedParticipant = (await yookassaCreateInvoice( participant.id )).participant;
                participant.invoiceUrl = updatedParticipant.invoiceUrl;
                participant.invoiceId = updatedParticipant.invoiceId;
            }
        } else if ( !participant.invoice ) {
            const updatedParticipant =
                (await yookassaCreateInvoice( participant.id )).participant;
            participant.invoiceUrl = updatedParticipant.invoiceUrl;
            participant.invoiceId = updatedParticipant.invoiceId;
        }
    }

    const participantUsers = await ParticipantUserRepository.findAll( {
        where: {
            participantId: participant.id
        }
    } );
    return res.json( { participant, participantUsers } );
}
