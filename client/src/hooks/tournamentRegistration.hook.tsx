import {Dispatch, useCallback, useReducer, useState} from "react";
import {IUser} from "../StoreTypes";

export interface IRegisterForm {
    id?: number,
    tournamentId: null | number,
    capitan: null | number,
    teamId: null | number,
    players: Array<IUser>,
}

const initRegisterForm: IRegisterForm = {
    tournamentId: null,
    capitan: null,
    teamId: null,
    players: []
}

const requestReducer = (state: IRegisterForm, action: {type: string, data: any}) => {
    if (action.type === 'changeField') {
        return {...state, [action.data.name]: action.data.value};
    }
    if (action.type === 'removePlayer') {
        return {
            ...state,
            'players': state.players.filter((user) => user.id !== action.data.requestPlayer.id)
        };
    }
    if (action.type === 'addPlayer') {
        return {
            ...state,
            'players': [...state.players, action.data.requestPlayer]
        };
    }
    if (action.type === 'update') {
        return action.data
    }
    throw Error('Unknown action.');
}

export const useTournamentRegistration = () => {
    const [registerRequest, reduceRegisterRequest] = useReducer(requestReducer, initRegisterForm)

    const changeRegisterForm = (name: string | null, value: any) => {
        if (name && name in registerRequest) {
            reduceRegisterRequest({type: 'changeField', data: {name, value}})
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
                reduceRegisterRequest({type: 'removePlayer', data: {requestPlayer}})
            } else if (playersInTeam > registerRequest.players.length) {
                reduceRegisterRequest({type: 'addPlayer', data: {requestPlayer}})
            }
        }
    }

    return {
        isUserIdIncludedInRequest,
        changeRequestPlayers,
        registerRequest,
        changeRegisterForm,
        setRegisterRequest: (data: IRegisterForm) => {
            reduceRegisterRequest({type: 'update', data})
        }
    }
}