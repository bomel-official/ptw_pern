import {
    CV,
    generateValidator,
    isError,
    Participant,
    Team,
    Tournament,
    User
} from "@core";
import { ApiError } from "@error";
import { Request } from "express";
import { Op } from "sequelize";
import { isAdmin } from "../libs";

export async function postOneValidate( req: Request ) {
    const validated = generateValidator(
        () => ({
            teamId: new CV( req.body.teamId, { label: "teamId" } ).number().val,
            players: new CV( req.body.players, { label: "players" } ).array(
                player => new CV( player ).number().val ).val,
            tournamentId: new CV( req.body.tournamentId,
                { label: "tournamentId" } ).number().val,
            id: new CV( req.body.id, { label: "id" } ).optional()
                .number().val,
            payMethod: new CV( req.body.payMethod,
                { label: "payMethod" } ).string().val
        }) );
    if ( isError( validated ) ) {
        return validated.errorObject;
    }
    const { teamId, players, tournamentId, id, payMethod } = validated.data;

    if ( !req.user || !req.user.id ) {
        return ApiError.unauthorized( "Не авторизован" );
    }

    const tournament = await Tournament.findByPk( tournamentId );
    const team = await Team.findByPk( teamId );
    const reqUser = await User.findByPk( req.user.id );

    if ( !reqUser ) {
        return ApiError.badRequest( "Пользователь не найден, перезайдите" );
    }

    if ( !tournament ) {
        return ApiError.badRequest( "Турнир не найден" );
    }

    if ( !team ) {
        return ApiError.badRequest( "Команда не найдена" );
    }

    if ( team.capitanId !== reqUser.id && !isAdmin( reqUser ) ) {
        return ApiError.forbidden( "Нет доступа" );
    }

    if ( players.length !== tournament.playersInTeam ) {
        return ApiError.badRequest( "Некорректное количество участников!" );
    }

    const alreadyRegisteredParticipant = await Participant.findOne( {
        where: {
            id: id ? {
                [Op.ne]: id
            } : {},
            tournamentId: tournament.id,
        },
        include: [
            {
                model: User,
                as: "users",
                where: {
                    id: {
                        [Op.in]: players
                    }
                }
            }
        ]
    } );
    if ( alreadyRegisteredParticipant &&
        alreadyRegisteredParticipant.users[0] ) {
        return ApiError.badRequest(
            `${ alreadyRegisteredParticipant.users[0].nickname } - уже учавствует в другой команде` );
    }

    return {
        players, tournament, id, payMethod, team, reqUser
    } as const;
}
