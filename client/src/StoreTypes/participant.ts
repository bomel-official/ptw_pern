import { ITeam, Team } from "./team";
import { IUser } from "./user";

export type IParticipant = {
    id: number,
    teamId: number,
    team: Team,
    users: Array<IUser>,
    points: number,
    dataArray: Array<Array<number>>,
    places: Array<[ number, number ]>,
    isRoundsHidden: Array<boolean>,
    players: Array<number>,
    payMethod: string,
    roomNumber: number,
    isPaid: boolean,
    invoiceUrl: string,
    participant_request: IParticipantRequest
}

export type IParticipantRequest = {
    id: number,
    points: number,
    dataArray: Array<Array<number>>,
    places: Array<[ number, number ]>,
    isRoundsHidden: Array<boolean>,
    status: string,
    participantId: number,
    approveUrl: string,
}

export type IParticipantRequestDTO = {
    dataArray: Array<Array<number>>,
    places: Array<[ number, number ]>,
    isRoundsHidden: Array<boolean>,
    participantId: number,
    approve: null | File,
    approveFilename: string,
}
