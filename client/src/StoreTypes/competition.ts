import { Team } from "./team";
import { IUser } from "./user";

export interface CompetitionParticipant<TItem> {
    index: number;
    items: TItem[];
    points: number;
}

export interface CompetitionTable {
    id: number;
    type: "user" | "team";
    itemsInTeam: number;
    allowShuffle: boolean;
    users: IUser[];
    teams: Team[];
    participantsUsers: CompetitionParticipant<IUser | Team>[][];
    isOutsiders: boolean;
    outsidersUsers: CompetitionParticipant<IUser | Team>[][];
    parentType: "competition" | "tournament";
    tournamentId?: number;
    competitionId?: number;
}

export interface Competition {
    id: number;
    title: string;
    participantsAmount: number;
    authorId: number;
    competitionTable: CompetitionTable;
}

export interface CompetitionTableDTO {
    id?: number;
    type: "user" | "team";
    allowShuffle: boolean;
    itemsInTeam: number;
    users: IUser[];
    teams: Team[];
    participantsUsers: CompetitionParticipant<IUser | Team>[][];
    isOutsiders: boolean;
    outsidersUsers: CompetitionParticipant<IUser | Team>[][];
    parentType: "competition" | "tournament";
    tournamentId?: number;
    competitionId?: number;
}

export interface CompetitionDTO {
    id?: number;
    authorId?: number,
    title: string;
    competitionTable: CompetitionTableDTO;
}

export interface CompetitionTableDTORequest
    extends Omit<CompetitionTableDTO, "users" | "teams" | "participantsUsers" | "outsidersUsers"> {
    participants: CompetitionParticipant<number>[][];
    outsiders: CompetitionParticipant<number>[][];
}

export interface CompetitionDTORequest {
    id?: number,
    title: string;
    participantsAmount: number;
}
