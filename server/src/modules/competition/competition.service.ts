import {
    Competition,
    CompetitionNormalized,
    CompetitionRepository,
    CompetitionTable,
    CompetitionTableNormalized,
    CompetitionTableRepository,
    JWTUserData,
    TeamRepository,
    UserRepository,
} from "@core";
import { ApiError } from "@error";
import { withTransaction } from "@shared";
import { Transaction } from "sequelize";
import { normalizeCompetition } from "../../core/libs/normalize-competition";
import { normalizeCompetitionTable } from "../../core/libs/normalize-competition-table";
import { isAdmin } from "../../controllers/libs";
import { UpsertCompetitionDto, UpsertCompetitionTableDto } from "./competition.dto";
import { collectMemberIds } from "./competition.lib";

const tableInclude = [
    { model: UserRepository, as: "users" },
    { model: TeamRepository, as: "teams" },
];

async function syncMembers(
    table: CompetitionTable,
    type: "user" | "team",
    ids: number[],
    transaction: Transaction,
): Promise<void> {
    for ( const id of ids ) {
        if ( type === "user" ) {
            await table.addUser( id, { transaction } );
        } else {
            await table.addTeam( id, { transaction } );
        }
    }
}

export const competitionService = {
    async getOne( id: number ): Promise<CompetitionNormalized | null> {
        const competition = await CompetitionRepository.findByPk( id, {
            include: [ {
                model: CompetitionTableRepository,
                as: "competitionTable",
                include: tableInclude,
            } ],
        } );
        return normalizeCompetition( competition );
    },

    async getMany( type: string, user?: JWTUserData ): Promise<Competition[]> {
        if ( type === "all" ) {
            return CompetitionRepository.findAll( { limit: 20 } );
        }

        if ( type === "own" ) {
            if ( !user?.id ) {
                throw ApiError.unauthorized();
            }
            const owner = await UserRepository.findOne( {
                where: { id: user.id },
                include: [ { model: CompetitionRepository, as: "competitions", foreignKey: "authorId" } ],
            } );
            if ( !owner ) {
                throw ApiError.unauthorized();
            }
            return owner.competitions;
        }

        if ( type === "own-included" ) {
            if ( !user?.id ) {
                throw ApiError.unauthorized();
            }
            return CompetitionRepository.findAll( {
                where: { "$competitionTable.users.id$": user.id },
                include: [ {
                    model: CompetitionTableRepository,
                    as: "competitionTable",
                    include: [ { model: UserRepository, as: "users", attributes: [ "id" ] } ],
                } ],
            } );
        }

        throw ApiError.badRequest( "Некорректный запрос" );
    },

    async upsertCompetition( dto: UpsertCompetitionDto, user?: JWTUserData ): Promise<Competition> {
        const { id, title, participantsAmount } = dto;

        if ( id ) {
            const competition = await CompetitionRepository.findByPk( id );
            if ( !competition ) {
                throw ApiError.badRequest( "Запись не найдена" );
            }
            if ( !user?.id || user.id !== competition.authorId ) {
                throw ApiError.forbidden( "Нет доступа" );
            }
            competition.title = title;
            competition.participantsAmount = participantsAmount;
            await competition.save();
            return competition;
        }

        if ( !user?.id ) {
            throw ApiError.unauthorized();
        }
        return CompetitionRepository.create( { title, participantsAmount, authorId: user.id } );
    },

    async upsertTable(
        dto: UpsertCompetitionTableDto,
        user?: JWTUserData,
    ): Promise<CompetitionTableNormalized | null> {
        const {
            id, competitionId, isOutsiders, outsiders, type, parentType, participants,
            tournamentId, itemsInTeam, allowShuffle,
        } = dto;
        const memberIds = collectMemberIds( participants );

        const savedId = await withTransaction( async ( t ) => {
            if ( id ) {
                const table = await CompetitionTableRepository.findByPk( id, {
                    include: tableInclude,
                    transaction: t,
                } );
                if ( !table ) {
                    throw ApiError.badRequest( "Запись не найдена" );
                }
                if ( !user?.id || (user.id !== table.authorId && !isAdmin( user )) ) {
                    throw ApiError.forbidden( "Нет доступа" );
                }

                table.set( {
                    isOutsiders, outsiders, type, parentType, participants, itemsInTeam, allowShuffle,
                } );
                await table.save( { transaction: t } );

                for ( const member of table.users ) {
                    await table.removeUser( member, { transaction: t } );
                }
                for ( const member of table.teams ) {
                    await table.removeTeam( member, { transaction: t } );
                }
                await syncMembers( table, type, memberIds, t );
                return table.id;
            }

            if ( !user?.id ) {
                throw ApiError.unauthorized();
            }
            if (
                (parentType === "tournament" && !tournamentId) ||
                (parentType === "competition" && !competitionId)
            ) {
                throw ApiError.badRequest(
                    `Поле ${ parentType === "tournament" ? "tournamentId" : "competitionId" } не заполнено`,
                );
            }
            if ( parentType === "tournament" && !isAdmin( user ) ) {
                throw ApiError.forbidden();
            }

            const table = await CompetitionTableRepository.create( {
                authorId: user.id,
                type, parentType, itemsInTeam, participants, outsiders, isOutsiders, allowShuffle,
                competitionId, tournamentId,
            }, { transaction: t } );
            await syncMembers( table, type, memberIds, t );
            return table.id;
        } );

        const responseTable = await CompetitionTableRepository.findByPk( savedId, {
            include: tableInclude,
        } );
        return normalizeCompetitionTable( responseTable );
    },
};
