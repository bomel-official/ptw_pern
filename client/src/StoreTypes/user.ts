import { DeviceIds, PlatformIds } from "../data/Platforms";

export type IUser = {
    id: number,
    nickname: string,
    avatar: string,
    platform: PlatformIds,
    device: DeviceIds,
    role: string,
    activisionId?: string,
    createdAt?: string,
    averagePlace?: number,
    friends: number[],
    discord_id?: string,
    discord_username?: string,
    discord_avatar?: string,
    youtube?: string,
    twitter?: string;
    twitch?: string,
    notifications?: number,
    statsToursPlayed: number,
    statsToursList: Array<number>,
    statsToursWon: number,
    statsToursTop3: number,
    statsAverageKills: number,
    statsAmountKills: number
}
