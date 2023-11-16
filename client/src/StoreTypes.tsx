import {IGame} from "./context/GameContext";
import {PlatformIds} from "./data/Platforms";
import {IGameOnlyVersion} from "./data/Games";

export interface IMessageOptions {
    status: string,
    text: null|string
}

export type IBuildWeapon = {
    id: number,
    gameVersion: IGameOnlyVersion,
    title_RU: string,
    title_EU: string,
    image: string
}

export type IBuildAttachmentType = {
    id: number,
    title_RU: string,
    title_EU: string,
}

export type IBuildAttachment = {
    id: number,
    gameVersion: IGameOnlyVersion,
    buildAttachmentType: IBuildAttachmentType,
    build_attachment_type: number,
    title_RU: string,
    title_EU: string,
    isNumerable: boolean,
    allowedWeapons: Array<number>,
}

export type IBuildWeaponType = {
    id: number,
    title_RU: string,
    title_EU: string
}

export type IBuild = {
    id: number,
    gameVersion: IGameOnlyVersion,
    attachments: Array<Array<number>>,
    build_weapon: IBuildWeapon,
    buildWeaponId: number,
    build_weapon_type: IBuildWeaponType,
    buildWeaponTypeId: number
    user: IUser,
    createdAt: string,
    likes: Array<number>,
    likesCount: number
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
    friends: number[],
    discord?: string,
    youtube?: string,
    twitter?: string;
    twitch?: string
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
    teamCapitan: null | number,
    avatar: null | File,
    name: null | string,
    avatar_path: null | string,
    teamPlayers: Array<IUser>,
}

export type IParticipant = {
    id: number,
    title: string,
    users: Array<IUser>,
    points: number,
    dataArray: Array<Array<number>>,
    places: Array<number>,
    isRoundsHidden: Array<boolean>,
    avatar: string,
    players: Array<number>
}