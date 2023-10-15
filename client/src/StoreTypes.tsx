export type IUserPlatform = 'pc' | 'xbox' | 'playstation'

export type IUser = {
    id: number,
    nickname: string,
    avatar: string,
    platform?: IUserPlatform,
    role: string,
    activisionId?: string,
    createdAt?: string,
    averagePlace?: number,
    toursPlayed?: number,
    friends: number[]
}
export type ITournament = any
export type ITeam = {
    id: null | number,
    capitan: null | number,
    avatar: null | File,
    name: null | string,
    avatar_path: null | string,
    players: Array<IUser>,
}