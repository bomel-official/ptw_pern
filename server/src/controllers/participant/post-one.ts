import { AMOUNT_ROUNDS } from "@constants";
import { yookassaCreateInvoice } from "@controllers";
import { Participant, User } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { isAdmin } from "../libs";
import { getParticipantRoomNumber } from "../libs/get-participant-room-number";
import { postOneValidate } from "./post-one-validate";

export async function postOne( req: Request, res: Response,
                               next: NextFunction ) {
    const validated = await postOneValidate( req );
    if ( validated instanceof Error ) {
        return next( validated );
    }
    const {
        team, players, tournament, id, payMethod, reqUser
    } = validated;

    if ( !id || isAdmin( reqUser ) ) { // Create participant
        const roomNumber = await getParticipantRoomNumber( tournament.id );

        let newReq = await Participant.create( {
            tournamentId: tournament.id,
            points: 0,
            teamId: team.id,
            payMethod,
            isRoundsHidden: Array( AMOUNT_ROUNDS ).fill( false ),
            dataArray: Array( players.length )
                .fill( Array( AMOUNT_ROUNDS ).fill( 0 ) ),
            places: Array( AMOUNT_ROUNDS ).fill( [ -1, 0 ] ),
            roomNumber
        } );
        for ( const playerId of players ) {
            const player = await User.findByPk( playerId );
            if ( player ) {
                await newReq.addUser( player );
                await tournament.addPlayer( player );
            } else {
                return next(
                    ApiError.badRequest( "Ошибка, некорректный запрос" ) );
            }
        }

        if ( tournament.participationPrice ) {
            const yookassaParticipant = (await yookassaCreateInvoice(
                newReq.id )).participant;
            if ( yookassaParticipant && yookassaParticipant.payMethod ===
                "enot" ) {
                return res.json( {
                    isOk: true, message: "Вы зарегистрировалиь на турнир!",
                    url: yookassaParticipant.invoiceUrl
                } );
            }
        }
        return res.json(
            { isOk: true, message: "Вы зарегистрировалиь на турнир!" } );
    } else { // Edit participant
        const participant = await Participant.findOne( {
            where: {
                id
            },
            include: {
                model: User,
                as: "users"
            }
        } );

        if ( !participant ) {
            return next( ApiError.badRequest( "Участник не найден" ) );
        }

        participant.teamId = team.id;
        participant.payMethod = payMethod;
        await participant.save();
        const participantUsers = participant.users.map(
            ( user ) => (user.id) );

        const toAddUsers: User[] = [];
        const toRemoveUsers: User[] = [];

        for ( const playerId of players ) {
            const player = await User.findByPk( playerId );
            if ( player && !participantUsers.includes( player.id ) ) {
                toAddUsers.push( player );
            }
        }
        participant.users.forEach( user => {
            if ( user && !players.includes( user.id ) ) {
                toRemoveUsers.push( user );
            }
        } );
        for ( const user of toRemoveUsers ) {
            await participant.removeUser( user );
            await tournament.removePlayer( user );
        }
        for ( const user of toAddUsers ) {
            await participant.addUser( user );
            await tournament.addPlayer( user );
        }
    }

    res.json( { isOk: true, message: "Вы зарегистрировалиь на турнир!" } );
}
