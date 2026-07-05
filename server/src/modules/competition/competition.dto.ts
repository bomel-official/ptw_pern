import { CompetitionParticipant } from "@core";

export interface UpsertCompetitionDto {
    id?: number;
    title: string;
    participantsAmount: number;
}

export interface UpsertCompetitionTableDto {
    id?: number;
    competitionId?: number;
    tournamentId?: number;
    allowShuffle: boolean;
    isOutsiders: boolean;
    type: "user" | "team";
    itemsInTeam: number;
    parentType: "tournament" | "competition";
    participants: CompetitionParticipant<number>[][];
    outsiders: CompetitionParticipant<number>[][];
}

export type CompetitionListType = "all" | "own" | "own-included";
