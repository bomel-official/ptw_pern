import { Dispatch } from "react";
import { IParticipant, IUser } from "../../../StoreTypes";
import { setMatrixCell, setPlacesCell, toggleRoundHidden } from "./rating-helpers";

export const isUserInParticipant = ( participant: IParticipant, user: IUser | null ) => {
    return (
        user !== null &&
        participant.users.find( ( _user ) => _user.id === user.id ) !== undefined
    );
};

export const useTournamentLiveEdit = (
    participants: Array<IParticipant>,
    setParticipants: Dispatch<Array<IParticipant>>,
) => {
    const changeParticipant = ( index: number, newParticipant: IParticipant ) => {
        setParticipants( participants.map( ( ptsp, i ) => (i === index ? newParticipant : ptsp) ) );
    };

    const setParticipantPlayerKills = ( index: number, i: number, j: number, value: number ) => {
        const participant = participants[index];
        changeParticipant( index, {
            ...participant,
            dataArray: setMatrixCell( participant.dataArray, j, i, value ),
        } );
    };

    const setParticipantPlaces = ( index: number, i: number, item: 0 | 1, value: number ) => {
        const participant = participants[index];
        changeParticipant( index, {
            ...participant,
            places: setPlacesCell( participant.places, i, item, value ),
        } );
    };

    const setRoundsHidden = ( index: number, i: number ) => {
        const participant = participants[index];
        changeParticipant( index, {
            ...participant,
            isRoundsHidden: toggleRoundHidden( participant.isRoundsHidden, i ),
        } );
    };

    return {
        changeParticipant,
        setParticipantPlayerKills,
        setParticipantPlaces,
        setRoundsHidden,
    };
};
