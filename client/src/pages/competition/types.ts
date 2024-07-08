import { Competition, CompetitionParticipant, IUser, Team } from "../../StoreTypes";

export interface CompetitionDetailProps {
    competition: Competition | null;
}

export interface CompetitionTableProps {
    data: CompetitionParticipant<IUser | Team>[][];
    setValue: (( competition: CompetitionParticipant<IUser | Team>, rowIndex: number, index: number ) => void) | null;
}
