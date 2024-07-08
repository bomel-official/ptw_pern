import { IGameOnly } from "../context/GameContext";
import { CompetitionTable } from "./competition";
import { IUser } from "./user";

export type ITournament = {
    id: number,
    title_RU: string,
    title_EU: string,
    game: IGameOnly,
    slug: string,
    type: "tournament" | "hub" | null,
    isRegisterOn: boolean,
    twitchChannel: string,
    dateBegin: Date,
    dateEnd: Date,
    previewImg: string,
    maxUsers: number,
    players: Array<IUser>,
    playersInTeam: number,
    participationPrice: number,
    prizes: number,
    prize_1: number,
    prize_2: number,
    prize_3: number,
    format_RU: string,
    format_EU: string,
    descRules_RU: string,
    descRules_EU: string,
    descAdditional_RU: string,
    descAdditional_EU: string,
    participantsList: Array<number>
    participantType: "list" | "table",
    competitionTable?: CompetitionTable
}
