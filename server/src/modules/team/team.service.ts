import { TEAMS_LIMIT, UserRoleGroup } from "@constants";
import { Team, TeamRepository, TeamRequestRepository, User, UserRepository } from "@core";
import { ApiError } from "@error";
import { withTransaction } from "@shared";
import { Op } from "sequelize";
import { isUserInGroup } from "../../controllers/libs";
import { SaveTeamDto, TeamSearchQuery } from "./team.validation";

interface TeamResponse {
    id: number;
    avatar?: string;
    name?: string;
    capitanId: number;
    players: User[];
}

export const teamService = {
    async search( query: TeamSearchQuery ): Promise<Team[]> {
        const { type, userId, s } = query;
        const teamIds: number[] = [];

        if ( userId && type === "part" ) {
            const teamReqs = await TeamRequestRepository.findAll( { where: { userId } } );
            for ( const item of teamReqs ) {
                teamIds.push( item.teamId );
            }
        }

        return TeamRepository.findAll( {
            where: {
                ...(userId && type === "own" ? { capitanId: userId } : {}),
                ...(userId && type === "part" ? { id: teamIds } : {}),
                ...(typeof s === "string" ? { name: { [Op.iLike]: `%${ s }%` } } : {}),
            },
            include: [
                { model: UserRepository, association: "players", isMultiAssociation: true, as: "players" },
                { model: UserRepository, as: "capitan", foreignKey: "capitanId", isMultiAssociation: true },
            ],
            ...(typeof s === "string" ? { limit: 10 } : {}),
        } );
    },

    async save( dto: SaveTeamDto ): Promise<{ team: TeamResponse; created: boolean }> {
        const { players, filename, id, capitanId, reqUser, name } = dto;

        const creator = await UserRepository.findOne( {
            where: { id: reqUser.id },
            include: { model: TeamRepository, as: "own_teams" },
        } );
        if ( !creator ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        if ( name.length < 3 ) {
            throw ApiError.badRequest( "Название команды должно быть 3 и больше символов" );
        }
        const isCreatorAdmin = isUserInGroup( creator.role, UserRoleGroup.ADMIN );
        for ( const playerId of players ) {
            if ( !isCreatorAdmin && !creator.friends.includes( playerId ) && creator.id !== playerId ) {
                throw ApiError.badRequest( "Для добавления в команду игрок должен быть у вас в друзьях" );
            }
        }

        if ( id ) {
            // Edit
            const team = await TeamRepository.findOne( {
                where: { id },
                include: { model: UserRepository, as: "players" },
            } );
            if ( !team || !team.players || (reqUser.id !== team.capitanId && !isCreatorAdmin) ) {
                throw ApiError.badRequest( "Вы не можете редактировать эту команду" );
            }

            const playersResponse = await withTransaction( async ( t ) => {
                for ( const player of team.players ) {
                    if ( !players.includes( player.id ) ) {
                        await team.removePlayer( player.id, { transaction: t } );
                    }
                }
                const collected: User[] = [];
                for ( const playerId of players ) {
                    const player = await UserRepository.findByPk( playerId, { transaction: t } );
                    if ( !player ) {
                        throw ApiError.badRequest( "Пользователь не найден" );
                    }
                    collected.push( player );
                    await team.addPlayer( playerId, { transaction: t } );
                }
                team.name = name;
                team.avatar = filename || team.avatar;
                await team.save( { transaction: t } );
                return collected;
            } );

            return {
                created: false,
                team: {
                    id: team.id, avatar: team.avatar, name: team.name,
                    capitanId: team.capitanId, players: playersResponse,
                },
            };
        }

        // Create
        if ( !isCreatorAdmin && reqUser.id !== capitanId ) {
            throw ApiError.badRequest( "Ошибка, некорректный запрос" );
        }
        if ( !isCreatorAdmin && creator.own_teams.length >= TEAMS_LIMIT ) {
            throw ApiError.badRequest( "Вы не можете создать больше 5 команд" );
        }
        const slug = name.toString().toLowerCase().trim().replace( / /g, "-" ).replace( /[^\w-]+/g, "" );
        if ( slug.length <= 3 ) {
            throw ApiError.badRequest(
                "Название команды должно быть длиннее 3 символов, написано латиницей, без особых символов" );
        }

        const { team, playersResponse } = await withTransaction( async ( t ) => {
            const createdTeam = await TeamRepository.create( {
                name, avatar: filename, capitanId: capitanId || reqUser.id, slug,
            }, { transaction: t } );
            await creator.addOwn_team( createdTeam, { transaction: t } );
            const collected: User[] = [];
            for ( const playerId of players ) {
                const player = await UserRepository.findByPk( playerId, { transaction: t } );
                if ( !player ) {
                    throw ApiError.badRequest( "Пользователь не найден" );
                }
                collected.push( player );
                await createdTeam.addPlayer( playerId, { transaction: t } );
            }
            return { team: createdTeam, playersResponse: collected };
        } );

        return {
            created: true,
            team: {
                id: team.id, avatar: team.avatar, name: team.name,
                capitanId: team.capitanId, players: playersResponse,
            },
        };
    },

    async deleteOrLeave( teamId: number, userId: number ): Promise<{ message: string }> {
        const team = await TeamRepository.findByPk( teamId );
        if ( !team ) {
            throw ApiError.badRequest( "Команда не найдена" );
        }

        if ( userId === team.capitanId ) {
            await team.destroy();
            return { message: "Команда успешно удалена!" };
        }

        const user = await UserRepository.findByPk( userId );
        if ( !user ) {
            throw ApiError.badRequest( "Ошибка сервера: пользователь не найден" );
        }
        await team.removePlayer( user );
        return { message: "Вы успешно покинули комаду!" };
    },
};
