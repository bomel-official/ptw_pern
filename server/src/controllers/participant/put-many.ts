import { AMOUNT_ROUNDS } from "@constants";
import { CV, generateValidator, isError, ParticipantRepository, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { calcAmountKills } from "../libs";

export async function putMany( req: Request, res: Response,
                               next: NextFunction ) {
    const validated = generateValidator( () => ({
        participants: new CV( req.body.participants, { label: "participants" } ).array( ( item ) =>
            new CV( item ).object( ( participant ) => ({
                id: new CV( participant.id ).number().val,
                dataArray: new CV( participant.dataArray ).array(
                    ( dataRow ) => new CV( dataRow ).array(
                        ( dataCell ) => new CV( dataCell ).number().val ).val
                ).val,
                places: new CV( participant.places ).array(
                    ( placesRow ) => new CV( placesRow ).array(
                        ( placesCell ) => new CV(
                            placesCell ).number().val ).val
                ).val,
                points: new CV( participant.points || 0 ).number().val,
                isRoundsHidden: new CV( participant.isRoundsHidden ).array(
                    isRoundHidden => new CV( isRoundHidden ).bool().val ).val,
                players: new CV( participant.players ).number().val
            }) ).val
        ).val,
    }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { participants } = validated.data;

    if ( participants.length === 0 ) {
        return res.json( { isOk: true, message: "Данные обновлены!" } );
    }

    for ( let participant of participants ) {
        let points = 0;
        for ( let i = 0; i < AMOUNT_ROUNDS; i++ ) {
            points += participant.places[i][1];
            if ( !(participant.isRoundsHidden.length &&
                participant.isRoundsHidden[i]) ) {
                for ( let j = 0; j < participant.players; j++ ) {
                    points += participant.dataArray[j][i];
                }
            }
        }
        participant.points = points;
    }
    participants.sort( ( a, b ) => (b.points - a.points) );

    const firstParticipant = await ParticipantRepository.findByPk(
        participants[0].id ); // To know tournamentId

    if ( !firstParticipant ) {
        return next( ApiError.badRequest( "Ошибка...." ) );
    }
    const tournamentId = firstParticipant.tournamentId;

    const oldParticipants = await ParticipantRepository.findAll( {
        where: {
            tournamentId: tournamentId
        },
        order: [
            [ "points", "DESC" ],
            [ "id", "ASC" ],
            [ { model: UserRepository, as: "users" }, "id", "ASC" ],
        ],
        include: [
            { model: UserRepository, as: "users" }
        ]
    } );

    for ( let i = 0; i < oldParticipants.length; i++ ) {
        const participant = oldParticipants[i];
        for ( let userIndex = 0; userIndex <
        participant.users.length; userIndex++ ) {
            const user = participant.users[userIndex];

            if ( user.statsToursList.includes(
                participant.tournamentId ) ) {
                if ( i === 0 && user.statsToursWon > 0 ) {
                    user.statsToursWon -= 1;
                }
                if ( i < 3 && user.statsToursTop3 > 0 ) {
                    user.statsToursTop3 -= 1;
                }
                user.statsAmountKills -=
                    calcAmountKills( participant.dataArray, userIndex );

                await user.save();
            }
        }
    }

    for ( let i = 0; i < participants.length; i++ ) {
        const updatedParticipant = participants[i];
        const participant = await ParticipantRepository.findByPk( participants[i].id,
            {
                order: [
                    [ { model: UserRepository, as: "users" }, "id", "ASC" ],
                ],
                include: [
                    { model: UserRepository, as: "users" },
                ]
            } );
        if ( !participant ) {
            return next( ApiError.badRequest( "Ошибка...." ) );
        }

        // User stats start
        for ( let userIndex = 0; userIndex <
        participant.users.length; userIndex++ ) {
            const user = participant.users[userIndex];

            if ( !user.statsToursList.includes(
                participant.tournamentId ) ) {
                user.statsToursList =
                    [ ...user.statsToursList, participant.tournamentId ];
            }

            if ( i === 0 ) {
                user.statsToursWon += 1;
            }
            if ( i < 3 ) {
                user.statsToursTop3 += 1;
            }
            user.statsToursPlayed = user.statsToursList.length;
            user.statsAmountKills +=
                calcAmountKills( updatedParticipant.dataArray, userIndex );
            user.statsAverageKills = user.statsAmountKills /
                (user.statsToursPlayed * AMOUNT_ROUNDS);

            await user.save();
        }

        // User stats end

        participant.dataArray = updatedParticipant.dataArray;
        participant.places = updatedParticipant.places;
        participant.isRoundsHidden = updatedParticipant.isRoundsHidden;
        participant.points = updatedParticipant.points;
        await participant.save();
    }

    return res.json( { isOk: true, message: "Данные обновлены!" } );
}
