import { Competition, CompetitionNormalized } from "@core";
import { normalizeCompetitionTable } from "./normalize-competition-table";

export function normalizeCompetition( competition: Competition | null ): CompetitionNormalized | null {
    if ( !competition || !competition.competitionTable ) return null;
    return {
        id: competition.id,
        title: competition.title,
        updatedAt: competition.updatedAt,
        createdAt: competition.createdAt,
        authorId: competition.authorId,
        participantsAmount: competition.participantsAmount,
        competitionTable: normalizeCompetitionTable( competition.competitionTable )
    };
}
