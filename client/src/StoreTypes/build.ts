import { IGameOnlyVersion } from "../data/Games";
import { IUser } from "./user";

export type IBuildWeapon = {
    id: number,
    gameVersion: IGameOnlyVersion,
    title_RU: string,
    title_EU: string,
    image: string,
    allowedAttachments: Array<number>,
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
    image: string
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
    title: string,
    isMeta: boolean,
}
