import { IUser } from "../../StoreTypes";

export interface UserSearchDropdownProps {
    onSelect: ( user: IUser | null ) => void;
    initialUser?: (IUser | null);
    variant?: "compact" | "normal";
    options?: (IUser | null)[];
}

export interface UserProfileCardProps {
    user: IUser;
}
