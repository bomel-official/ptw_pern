import { UploadedFile } from "express-fileupload";

export interface CreateUserDto {
    email: string;
    password: string;
    repeatPassword: string;
    nickname: string;
}

export interface UpdateUserDto {
    id: string;
    nickname: string;
    activisionId?: string;
    vk?: string;
    youtube?: string;
    steam?: string;
    twitch?: string;
    twitter?: string;
    password?: string;
    oldPassword?: string;
    platform?: string;
    device?: string;
    avatar?: UploadedFile | UploadedFile[] | null;
}
