import { Competition, CompetitionParticipant, CompetitionTable, IUser, Team } from "../../StoreTypes";

export interface CompetitionPreviewProps {
    competition: Competition;
    columns: number;
}

export interface ItemCardProps {
    item: CompetitionParticipant<IUser | Team>;
    setItem: (( item: CompetitionParticipant<IUser | Team> ) => void) | null;
    isWinner?: boolean;
    isNoPoints?: boolean;
    showClear?: boolean;
    isLink?: boolean;
}

export interface ItemSearchProps {
    type: CompetitionTable["type"];
    onSelect: ( item: IUser | Team ) => void;
    exclude: {
        users: IUser[],
        teams: Team[]
    };
}

export interface CompetitionItemsProps {
    type: CompetitionTable["type"];
    users: IUser[],
    teams: Team[],
    onDelete: (( item: IUser | Team ) => void) | null
}

export interface CompetitionItemSelectProps {
    options: CompetitionParticipant<IUser | Team>[];
    setItem: (( item: CompetitionParticipant<IUser | Team> ) => void) | null;
}
