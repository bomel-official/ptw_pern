import {IUser} from "../StoreTypes";
import {ProfileTabsIds} from "../data/Links";

export function getProfileUrl(user: IUser, isIncludeTab: boolean, tab: ProfileTabsIds = 'general'): string {
    return (isIncludeTab ? `/profile/${user.nickname}/${tab}` : `/profile/${user.nickname}`)
}