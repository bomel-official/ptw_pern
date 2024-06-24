import { TEAMS_LIMIT, UserRoleGroup } from "@constants";
import type { User } from "@core";
import { isError, TeamRepository, UserRepository } from "@core";
import { ApiError } from "@error";
import { NextFunction, Request, Response } from "express";
import { isUserInGroup } from "../libs";
import { postPutOneValidate } from "./post-put-one-validate";

export async function postPutOne( req: Request, res: Response, next: NextFunction ) {
    const validated = await postPutOneValidate( req );
    if ( isError( validated ) ) {
        return next( validated.errorObject );
    }
    const {
        players,
        filename,
        id,
        capitanId,
        reqUser,
        name
    } = validated.data;

    const creator = await UserRepository.findOne( {
        where: {
            id: reqUser.id
        },
        include: {
            model: TeamRepository,
            as: "own_teams"
        }
    } );

    if ( !creator ) {
        return next( ApiError.unauthorized( "Не авторизован" ) );
    }
    if ( name.length < 3 ) {
        return next( ApiError.badRequest( "Название команды должно быть 3 и больше символов" ) );
    }
    for ( let playerId of players ) {
        if (
            !isUserInGroup( creator.role, UserRoleGroup.ADMIN ) &&
            !creator.friends.includes( playerId ) &&
            creator.id !== playerId
        ) {
            return next( ApiError.badRequest( "Для добавления в команду игрок должен быть у вас в друзьях" ) );
        }
    }
    if ( id ) { // Edit
        const team = await TeamRepository.findOne( {
            where: {
                id
            },
            include: {
                model: UserRepository,
                as: "players"
            },
        } );
        if ( !team || !team.players || reqUser.id !== team.capitanId &&
            !isUserInGroup( creator.role, UserRoleGroup.ADMIN ) ) {
            return next( ApiError.badRequest(
                "Вы не можете редактировать эту команду" ) );
        }
        for ( let player of team.players ) {
            if ( !players.includes( player.id ) ) {
                await team.removePlayer( player.id );
            }
        }
        const playersResponse: User[] = [];
        for ( let playerId of players ) {
            const player = await UserRepository.findByPk( playerId );
            if ( !player ) {
                return next( ApiError.badRequest( "Пользователь не найден" ) );
            }
            playersResponse.push( player );
            await team.addPlayer( playerId );
        }

        team.name = name;
        team.avatar = filename || team.avatar;
        await team.save();
        const resTeam = {
            id: team.id,
            avatar: team.avatar,
            name: team.name,
            capitanId: team.capitanId,
            players: playersResponse
        };
        return res.json( { message: "Команда обновлена", team: resTeam } );
    } else { // Create
        if ( !isUserInGroup( creator.role, UserRoleGroup.ADMIN ) &&
            reqUser.id !== capitanId ) {
            return next( ApiError.badRequest( "Ошибка, некорректный запрос" ) );
        }
        if ( !isUserInGroup( creator.role, UserRoleGroup.ADMIN ) &&
            creator.own_teams.length >=
            TEAMS_LIMIT ) {
            return next(
                ApiError.badRequest( "Вы не можете создать больше 5 команд" ) );
        }
        const slug = name.toString().toLowerCase().trim().replace( / /g, "-" )
            .replace( /[^\w-]+/g, "" );
        if ( slug.length <= 3 ) {
            return next( ApiError.badRequest(
                "Название команды должно быть длиннее 3 символов, написано латиницей, без особых символов" ) );
        }
        const team = await TeamRepository.create( {
            name,
            avatar: filename,
            capitanId,
            slug
        } );
        const playersResponse: User[] = [];
        await creator.addOwn_team( team );
        for ( let playerId of players ) {
            const player = await UserRepository.findByPk( playerId );
            if ( !player ) {
                return next( ApiError.badRequest( "Пользователь не найден" ) );
            }
            playersResponse.push( player );
            await team.addPlayer( playerId );
        }
        const resTeam = {
            id: team.id,
            avatar: team.avatar,
            name: team.name,
            capitanId: team.capitanId,
            players: playersResponse
        };
        return res.json( { message: "Команда создана", team: resTeam } );
    }
}
