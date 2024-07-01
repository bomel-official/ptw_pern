import { CompetitionRepository, CV, generateValidator, isError, User, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { normalizeCompetition } from "../../core/libs/normalize-competition";

const EMPTY_NUMBER_VALUE = -1;
const UNDEFINED_NUMBER_VALUE = -2;

export async function postPutOne( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            id: new CV( req.body.id, { label: "id" } ).optional().number().val,
            title: new CV( req.body.title, { label: "title" } ).string().val,
            participantsAmount: new CV( req.body.participantsAmount, { label: "participantsAmount" } ).number().val,
            participants: new CV( req.body.participants, { label: "participants" } ).array(
                ( participantRow ) => new CV( participantRow ).array(
                    ( participantItem ) => new CV( participantItem ).number().val ).val ).val,
            isOutsiders: new CV( req.body.isOutsiders, { label: "isOutsiders" } ).bool().val,
            outsiders: new CV( req.body.outsiders, { label: "outsiders" } ).array(
                ( outsiderRow ) => new CV( outsiderRow ).array(
                    ( outsiderItem ) => new CV( outsiderItem ).number().val ).val ).val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const { id, title, participantsAmount, participants, isOutsiders, outsiders } = validated.data;

    const equalSizeParticipantsArrayLength: number = participants.reduce(
        ( acc, participantRow ) => participantRow.length > acc ? participantRow.length : acc, 0 );
    const equalSizeParticipantsArray: number[][] = participants.map( ( participantRow ) => [ ...participantRow,
        ...Array( equalSizeParticipantsArrayLength - participantRow.length ).fill( UNDEFINED_NUMBER_VALUE ) ] );

    const equalSizeOutsidersArrayLength: number = outsiders.reduce(
        ( acc, outsiderRow ) => outsiderRow.length > acc ? outsiderRow.length : acc, 0 );
    const equalSizeOutsidersArray: number[][] = outsiders.map( ( outsiderRow ) => [ ...outsiderRow,
        ...Array( equalSizeOutsidersArrayLength - outsiderRow.length ).fill( UNDEFINED_NUMBER_VALUE ) ] );

    if ( id ) { // Edit
        const competition = await CompetitionRepository.findByPk( id, {
            include: [ {
                model: UserRepository,
                as: "users"
            } ]
        } );
        if ( !competition ) {
            return next( ApiError.badRequest( "Запись не найдена" ) );
        }
        if ( !req.user || !req.user.id || req.user.id !== competition.authorId ) {
            return next( ApiError.forbidden( "Нет доступа" ) );
        }
        competition.title = title;
        competition.participantsAmount = participantsAmount;
        competition.participants = equalSizeParticipantsArray;
        competition.isOutsiders = isOutsiders;
        competition.outsiders = equalSizeOutsidersArray;
        await competition.save();

        const toAddUsers: User[] = [];
        const toRemoveUsers: User[] = [];

        const players: number[] = [];
        for ( const competitionRow of participants ) {
            for ( const competitionItem of competitionRow ) {
                if ( !players.includes( competitionItem ) && competitionItem !== EMPTY_NUMBER_VALUE ) {
                    players.push( competitionItem );
                }
            }
        }

        for ( const competitionRow of outsiders ) {
            for ( const competitionItem of competitionRow ) {
                if ( !players.includes( competitionItem ) && competitionItem !== EMPTY_NUMBER_VALUE ) {
                    players.push( competitionItem );
                }
            }
        }

        const competitionUsers = competition.users.map(
            ( user ) => (user.id) );
        for ( const playerId of players ) {
            const player = await UserRepository.findByPk( playerId );
            if ( player && !competitionUsers.includes( player.id ) ) {
                toAddUsers.push( player );
            }
        }
        competition.users.forEach( user => {
            if ( user && !players.includes( user.id ) ) {
                toRemoveUsers.push( user );
            }
        } );
        for ( const user of toRemoveUsers ) {
            await competition.removeUser( user );
        }
        for ( const user of toAddUsers ) {
            await competition.addUser( user );
        }

        const responseCompetition = await CompetitionRepository.findByPk( id, {
            include: [ {
                model: UserRepository,
                as: "users"
            } ]
        } );

        return res.json( { data: normalizeCompetition( responseCompetition ) } );
    } else { // Create
        if ( !req.user || !req.user.id ) {
            return next( ApiError.unauthorized() );
        }
        const competition = await CompetitionRepository.create( {
            title,
            participantsAmount,
            participants: equalSizeParticipantsArray,
            isOutsiders,
            outsiders: equalSizeOutsidersArray,
            authorId: req.user.id
        } );

        const players: number[] = [];
        for ( const competitionRow of participants ) {
            for ( const competitionItem of competitionRow ) {
                if ( !players.includes( competitionItem ) && competitionItem !== EMPTY_NUMBER_VALUE ) {
                    players.push( competitionItem );
                    await competition.addUser( competitionItem );
                }
            }
        }
        for ( const competitionRow of outsiders ) {
            for ( const competitionItem of competitionRow ) {
                if ( !players.includes( competitionItem ) && competitionItem !== EMPTY_NUMBER_VALUE ) {
                    players.push( competitionItem );
                    await competition.addUser( competitionItem );
                }
            }
        }
        const responseCompetition = await CompetitionRepository.findByPk( competition.id, {
            include: [ {
                model: UserRepository,
                as: "users"
            } ]
        } );

        return res.json( { data: normalizeCompetition( responseCompetition ) } );
    }

    return next( ApiError.badRequest( "Некорректный запрос" ) );
}
