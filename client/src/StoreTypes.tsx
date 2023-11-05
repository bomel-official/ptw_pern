import {IGame} from "./context/GameContext";
import {PlatformIds} from "./data/Platforms";

export interface IMessageOptions {
    status: string,
    text: null|string
}

export type IFriendRequest = {
    isAccepted: boolean,
    id: number,
    user_from: IUser,
    user_to: IUser,
    userToId: number,
    userFromId: number
}

export type IUser = {
    id: number,
    nickname: string,
    avatar: string,
    platform: PlatformIds,
    role: string,
    activisionId?: string,
    createdAt?: string,
    averagePlace?: number,
    toursPlayed?: number,
    friends: number[]
}
export type ITournament = {
    id: number,
    title_RU: string,
    title_EU: string,
    game: IGame,
    type: 'tournament'|'hub'|null,
    isRegisterOn: boolean,
    twitchChannel: string,
    dateBegin: Date,
    dateEnd: Date,
    previewImg: string,
    maxUsers: number,
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
}
export type ITeam = {
    id: null | number,
    capitan: null | number,
    avatar: null | File,
    name: null | string,
    avatar_path: null | string,
    players: Array<IUser>,
}