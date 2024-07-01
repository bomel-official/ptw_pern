import { Competition, IUser } from "../../StoreTypes";

export interface CompetitionDetailProps {
    competition: Competition | null;
}

export interface CompetitionTableProps {
    data: (IUser | null)[][];
    setValue: ( competition: IUser | null, rowIndex: number, index: number ) => void;
    isEdit: boolean;
}
