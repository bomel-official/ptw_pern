import {Dispatch, useCallback, useState} from "react";
import {IUser} from "../StoreTypes";

interface IRegisterForm {
    capitan: null | number,
    teamId: null | number,
    players: Array<IUser>,
}

const initRegisterForm: IRegisterForm = {
    capitan: null,
    teamId: null,
    players: []
}

export const useTournamentRegistration = () => {
    const [registerRequest, setRegisterRequest] = useState(initRegisterForm)

    const changeRegisterForm = (name: string | null, value: any) => {
        if (name && name in registerRequest) {
            setRegisterRequest({...registerRequest, [name]: value})
        }
    }

    const isUserIdIncludedInRequest = (userId: number) => {
        for (const player of registerRequest.players) {
            if (player.id === userId) {
                return true
            }
        }
        return false
    }

    const changeRequestPlayers = (requestPlayer: IUser, playersInTeam: number = 3) => {
        if (requestPlayer && (requestPlayer.id !== null)) {
            if (isUserIdIncludedInRequest(requestPlayer.id)) {
                setRegisterRequest({
                    ...registerRequest,
                    'players': registerRequest.players.filter((user) => user.id !== requestPlayer.id)
                })
            } else if (playersInTeam > registerRequest.players.length) {
                setRegisterRequest({
                    ...registerRequest,
                    'players': [...registerRequest.players, requestPlayer]
                })
            }
        }
    }

    return {
        isUserIdIncludedInRequest,
        changeRequestPlayers,
        registerRequest
    }
}