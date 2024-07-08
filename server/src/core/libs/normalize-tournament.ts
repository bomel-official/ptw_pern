import { Tournament, TournamentNormalized } from "@core";
import { normalizeCompetitionTable } from "./normalize-competition-table";

export function normalizeTournament( tournament: Tournament | null ): TournamentNormalized | null {
    if ( !tournament ) return null;
    return {
        id: tournament.id,
        title_RU: tournament.title_RU,
        title_EU: tournament.title_EU,
        previewImg: tournament.previewImg,
        slug: tournament.slug,
        game: tournament.game,
        type: tournament.type,
        twitchChannel: tournament.twitchChannel,
        dateBegin: tournament.dateBegin,
        dateEnd: tournament.dateEnd,
        maxUsers: tournament.maxUsers,
        playersInTeam: tournament.playersInTeam,
        participationPrice: tournament.participationPrice,
        prizes: tournament.prizes,
        prize_1: tournament.prize_1,
        prize_2: tournament.prize_2,
        prize_3: tournament.prize_3,
        participantsList: tournament.participantsList,
        isRegisterOn: tournament.isRegisterOn,
        descRules_EU: tournament.descRules_EU,
        descRules_RU: tournament.descRules_RU,
        descAdditional_EU: tournament.descAdditional_EU,
        descAdditional_RU: tournament.descAdditional_RU,
        format_EU: tournament.format_EU,
        format_RU: tournament.format_RU,
        participantType: tournament.participantType,
        players: tournament.players,
        competitionTable: normalizeCompetitionTable( tournament.competitionTable ?? null ),
        updatedAt: tournament.updatedAt,
        createdAt: tournament.createdAt,
    } as TournamentNormalized;
}
