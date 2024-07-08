import { IUser } from "./user";

export type IFriendRequest = {
    to: number;
    isAccepted: boolean,
    id: number,
    user_from: IUser,
    user_to: IUser,
    userToId: number,
    userFromId: number
}
