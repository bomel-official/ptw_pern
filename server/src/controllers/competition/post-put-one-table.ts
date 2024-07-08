import { CompetitionTableRepository, CV, generateValidator, isError, TeamRepository, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { normalizeCompetitionTable } from "../../core/libs/normalize-competition-table";
import { isAdmin } from "../libs";

const EMPTY_NUMBER_VALUE = -1;

export async function postPutOne( req: Request, res: Response, next: NextFunction ) {
    const validated = generateValidator(
        () => ({
            id: new CV( req.body.id, { label: "id" } ).optional().number().val,
            competitionId: new CV( req.body.competitionId, { label: "competitionId" } ).optional().number().val,
            tournamentId: new CV( req.body.tournamentId, { label: "tournamentId" } ).optional().number().val,
            allowShuffle: new CV( req.body.allowShuffle, { label: "allowShuffle" } ).bool().val,
            isOutsiders: new CV( req.body.isOutsiders, { label: "isOutsiders" } ).bool().val,
            type: new CV( req.body.type, { label: "type" } ).string().included( [ "user", "team" ] as const ).val,
            itemsInTeam: new CV( req.body.itemsInTeam, { label: "itemsInTeam" } ).number().val,
            parentType: new CV( req.body.parentType, { label: "parentType" } ).string().included(
                [ "tournament", "competition" ] as const ).val,
            participants: new CV( req.body.participants, { label: "participants" } ).array(
                ( participantRow ) => new CV( participantRow ).array(
                    ( participantItem ) => new CV( participantItem ).object( ( participantItemObject ) => ({
                            index: new CV( participantItemObject.index ).number().val,
                            points: new CV( participantItemObject.points ).number().val,
                            items: new CV( participantItemObject.items ).array(
                                ( participantItemObjectItem ) => new CV(
                                    participantItemObjectItem
                                ).number().val
                            ).val
                        })
                    ).val
                ).val
            ).val,
            outsiders: new CV( req.body.outsiders, { label: "outsiders" } ).array(
                ( outsiderRow ) => new CV( outsiderRow ).array(
                    ( outsiderItem ) => new CV( outsiderItem ).object( ( outsiderItemObject ) => ({
                            index: new CV( outsiderItemObject.index ).number().val,
                            points: new CV( outsiderItemObject.points ).number().val,
                            items: new CV( outsiderItemObject.items ).array(
                                ( outsiderItemObjectItem ) => new CV(
                                    outsiderItemObjectItem
                                ).number().val
                            ).val
                        })
                    ).val
                ).val
            ).val,
        }) );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const {
        id, competitionId, isOutsiders, outsiders, type, parentType, participants, tournamentId, itemsInTeam,
        allowShuffle
    } = validated.data;

    if ( id ) { // Edit
        const competitionTable = await CompetitionTableRepository.findByPk( id, {
            include: [ {
                model: UserRepository,
                as: "users"
            }, {
                model: TeamRepository,
                as: "teams"
            } ]
        } );

        if ( !competitionTable ) {
            return next( ApiError.badRequest( "Запись не найдена" ) );
        }
        if ( !req.user ||
            !req.user.id ||
            (req.user.id !== competitionTable.authorId && !isAdmin( req.user ))
        ) {
            return next( ApiError.forbidden( "Нет доступа" ) );
        }

        competitionTable.isOutsiders = isOutsiders;
        competitionTable.outsiders = outsiders;
        competitionTable.type = type;
        competitionTable.parentType = parentType;
        competitionTable.participants = participants;
        competitionTable.itemsInTeam = itemsInTeam;
        competitionTable.allowShuffle = allowShuffle;
        await competitionTable.save();

        competitionTable.users.forEach( user => {
            competitionTable.removeUser( user );
        } );
        competitionTable.teams.forEach( team => {
            competitionTable.removeTeam( team );
        } );

        const items: number[] = [];

        for ( const competitionRow of participants ) {
            for ( const competitionItem of competitionRow ) {
                for ( const competitionItemPlayer of competitionItem.items ) {
                    if ( !items.includes( competitionItemPlayer ) && competitionItem.index !== EMPTY_NUMBER_VALUE ) {
                        items.push( competitionItemPlayer );
                    }
                }
            }
        }

        for ( const itemId of items ) {
            if ( type === "user" ) {
                await competitionTable.addUser( itemId );
            } else {
                await competitionTable.addTeam( itemId );
            }
        }

        const responseCompetitionTable = await CompetitionTableRepository.findByPk( id, {
            include: [ {
                model: UserRepository,
                as: "users"
            }, {
                model: TeamRepository,
                as: "teams"
            } ]
        } );

        return res.json( { data: normalizeCompetitionTable( responseCompetitionTable ) } );
    } else { // Create
        if ( !req.user || !req.user.id ) {
            return next( ApiError.unauthorized() );
        }
        if (
            (parentType === "tournament" && !tournamentId) ||
            (parentType === "competition" && !competitionId)
        ) {
            return next( ApiError.badRequest(
                `Поле ${ parentType === "tournament" ? "tournamentId" : "competitionId" } не заполнено`
            ) );
        }
        if ( parentType === "tournament" && !isAdmin( req.user ) ) {
            return next( ApiError.forbidden() );
        }
        const competitionTable = await CompetitionTableRepository.create( {
            authorId: req.user.id,
            type,
            parentType,
            itemsInTeam,
            participants,
            outsiders,
            isOutsiders,
            allowShuffle,
            competitionId,
            tournamentId
        } );

        const items: number[] = [];

        for ( const competitionRow of participants ) {
            for ( const competitionItem of competitionRow ) {
                for ( const competitionItemPlayer of competitionItem.items ) {
                    if ( !items.includes( competitionItemPlayer ) && competitionItem.index !== EMPTY_NUMBER_VALUE ) {
                        items.push( competitionItemPlayer );
                    }
                }
            }
        }

        for ( const itemId of items ) {
            if ( type === "user" ) {
                await competitionTable.addUser( itemId );
            } else {
                await competitionTable.addTeam( itemId );
            }
        }

        const responseCompetitionTable = await CompetitionTableRepository.findByPk( competitionTable.id, {
            include: [ {
                model: UserRepository,
                as: "users"
            }, {
                model: TeamRepository,
                as: "teams"
            } ]
        } );

        return res.json( { data: normalizeCompetitionTable( responseCompetitionTable ) } );
    }
}
