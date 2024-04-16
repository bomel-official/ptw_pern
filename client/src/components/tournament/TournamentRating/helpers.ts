import {IParticipant, IUser} from "../../../StoreTypes";
import {Dispatch} from "react";
import {AMOUNT_ROUNDS, DEFAULT_ROUNDS_HIDDEN} from "./TournamentRating";

export const isUserInParticipant = (participant: IParticipant, user: IUser | null) => {
    return (
        user !== null &&
        participant.users.find((_user) => _user.id === user.id) !== undefined
    )
}

export const useTournamentLiveEdit = (participants: Array<IParticipant>, setParticipants: Dispatch<Array<IParticipant>>) => {
    const changeParticipant = (index: number, newParticipant: IParticipant) => {
        setParticipants(participants.map((ptsp, i) => {
            if (index === i) {
                return newParticipant
            }
            return ptsp
        }))
    }

    const setParticipantPlayerKills = (index: number, i: number, j: number, value: number) => {
        const newParticipant = {...participants[index]}
        newParticipant.dataArray[j][i] = value
        changeParticipant(index, newParticipant)
    }

    const setParticipantPlaces = (index: number, i: number, item: 0 | 1, value: number) => {
        const newParticipant = {...participants[index]}
        newParticipant.places[i][item] = value
        changeParticipant(index, newParticipant)
    }

    const setRoundsHidden = (index: number, i: number) => {
        const newParticipant = {...participants[index]}
        if (newParticipant.isRoundsHidden.length !== AMOUNT_ROUNDS) {
            newParticipant.isRoundsHidden = DEFAULT_ROUNDS_HIDDEN
        }
        newParticipant.isRoundsHidden[i] = !newParticipant.isRoundsHidden[i]
        changeParticipant(index, newParticipant)
    }

    return {
        changeParticipant,
        setParticipantPlayerKills,
        setParticipantPlaces,
        setRoundsHidden
    }
}