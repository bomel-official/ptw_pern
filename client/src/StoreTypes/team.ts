import { IUser } from "./user";

export type ITeam = {
    id: null | number,
    capitanId: null | number,
    avatar: null | File | string,
    name: null | string,
    avatar_path: null | string,
    players: Array<IUser>
}

export type Team = {
    id: number,
    capitanId: number,
    avatar: null | string,
    name: string,
    players: Array<IUser>
}

export type ITeamDTO = {
    id: null | number,
    capitanId: null | number,
    avatar: null | File | string,
    name: null | string,
    avatar_path: null | string,
    players: Array<IUser>
}
