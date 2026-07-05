import {
    CompetitionTableRepository,
    TeamRepository,
    Tournament,
    TournamentNormalized,
    TournamentRepository,
    UserRepository,
} from "@core";
import { ApiError } from "@error";
import { Op, Sequelize, WhereOptions } from "sequelize";
import { IncludeOptions } from "sequelize/types/model";
import { normalizeTournament } from "../../core/libs/normalize-tournament";
import { CreateTournamentDto } from "./tournament.validation";

interface GetManyQuery {
    status?: unknown;
    numberPosts?: unknown;
    game?: unknown;
    type?: unknown;
    userId?: unknown;
}

export const tournamentService = {
    async getMany( query: GetManyQuery ): Promise<Tournament[]> {
        const { status, numberPosts, game, type, userId } = query;
        let whereDateEndObject: WhereOptions = {};
        let orderType: [ string, "DESC" | "ASC" ][] = [
            [ "dateBegin", "DESC" ],
            [ "id", "DESC" ],
        ];
        if ( status === "active" ) {
            whereDateEndObject = { dateEnd: { [Op.gte]: Sequelize.literal( "NOW()" ) } };
            orderType = [ [ "dateBegin", "ASC" ], [ "id", "DESC" ] ];
        } else if ( status === "finished" ) {
            whereDateEndObject = { dateEnd: { [Op.lte]: Sequelize.literal( "NOW()" ) } };
        }

        let includeUser: IncludeOptions = {
            model: UserRepository, as: "players", attributes: [ "id" ],
        };
        if ( userId ) {
            includeUser = { ...includeUser, where: { id: userId } };
        }

        return TournamentRepository.findAll( {
            where: {
                [Op.and]: [
                    whereDateEndObject,
                    { game },
                    type ? { type } : {},
                ],
            },
            order: orderType,
            include: [ includeUser ],
            ...(typeof numberPosts === "string" && numberPosts !== "-1"
                ? { limit: parseInt( numberPosts ) }
                : {}),
        } );
    },

    async getOneBySlug( slug: string ): Promise<TournamentNormalized | null> {
        const tournament = await TournamentRepository.findOne( {
            where: { slug },
            include: [
                { model: UserRepository, as: "players", attributes: [ "id" ] },
                {
                    model: CompetitionTableRepository,
                    as: "competitionTable",
                    include: [ { model: TeamRepository, as: "teams" } ],
                },
            ],
        } );
        return normalizeTournament( tournament );
    },

    async create( dto: CreateTournamentDto ): Promise<Tournament> {
        const existing = await TournamentRepository.findOne( { where: { slug: dto.slug } } );
        if ( existing ) {
            throw ApiError.badRequest( "Турнир с такой ссылкой уже существует" );
        }
        return TournamentRepository.create( dto );
    },

    async update(
        id: number,
        slug: string,
        filename: string | undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: any,
    ): Promise<void> {
        const slugTournament = await TournamentRepository.findOne( {
            where: { [Op.and]: [ { slug }, { id: { [Op.not]: id } } ] },
        } );
        if ( slugTournament ) {
            throw ApiError.badRequest( "Турнир с такой ссылкой уже существует" );
        }

        const tournament = await TournamentRepository.findOne( { where: { id } } );
        if ( !tournament ) {
            throw ApiError.badRequest( "Турнир не найден" );
        }

        tournament.set( {
            title_RU: body.title_RU,
            title_EU: body.title_EU,
            slug,
            game: body.game,
            type: body.type,
            isRegisterOn: body.isRegisterOn,
            twitchChannel: body.twitchChannel,
            dateBegin: body.dateBegin,
            dateEnd: body.dateEnd,
            maxUsers: body.maxUsers,
            playersInTeam: body.playersInTeam,
            participationPrice: body.participationPrice,
            prizes: body.prizes,
            prize_1: body.prize_1,
            prize_2: body.prize_2,
            prize_3: body.prize_3,
            format_RU: body.format_RU,
            format_EU: body.format_EU,
            descRules_RU: body.descRules_RU,
            descRules_EU: body.descRules_EU,
            descAdditional_RU: body.descAdditional_RU,
            descAdditional_EU: body.descAdditional_EU,
            participantType: body.participantType,
        } );
        if ( filename ) {
            tournament.set( { previewImg: filename } );
        }
        await tournament.save();
    },
};
