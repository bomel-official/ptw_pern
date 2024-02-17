import {useCallback, useEffect, useReducer, useState} from "react";
import {useDebounce} from "./debounce.hook";

import {ITeam, IUser} from "../StoreTypes";
import {useHttp} from "./http.hook";
import {IRegisterForm} from "./tournamentRegistration.hook";

export const initNewTeam: ITeam = {
    id: null,
    name: null,
    avatar: null,
    avatar_path: null,
    capitanId: null,
    players: []
}

const teamReducer = (state: ITeam, action: {type: string, data: any}) => {
    if (action.type === 'changeField') {
        return {...state, [action.data.name]: action.data.value};
    }
    if (action.type === 'removePlayer') {
        return {
            ...state,
            'players': state.players.filter((player: IUser) => player.id !== action.data.requestPlayer.id)
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

export const useNewTeam = () => {
    const [newTeam, reduceNewTeam] = useReducer(teamReducer, initNewTeam)

    const changeNewTeam = (name: string | null, value: any) => {
        if (name === 'avatar') {
            if (FileReader && value) {
                let fr = new FileReader();
                fr.onload = function () {
                    if (typeof fr.result === 'string') {
                        reduceNewTeam({type: 'changeField', data: {name, value}})
                        reduceNewTeam({type: 'changeField', data: {name: 'avatar_path', value: fr.result}})
                    } else {
                        reduceNewTeam({type: 'changeField', data: {name, value}})
                    }
                }
                fr.readAsDataURL(value);
            }
        } else if (name && name in newTeam) {
            reduceNewTeam({type: 'changeField', data: {name, value}})
        }
    }

    const isUserIdIncluded = (userId: number) => {
        for (const player of newTeam.players) {
            if (player.id === userId) {
                return true
            }
        }
        return false
    }

    const changeNewTeamPlayers = (requestPlayer: IUser, action: 'remove' | 'add') => {
        if (action === 'remove') {
            reduceNewTeam({type: 'removePlayer', data: {requestPlayer}})
        } else if (action === 'add') {
            if (!isUserIdIncluded(requestPlayer.id)) {
                reduceNewTeam({type: 'addPlayer', data: {requestPlayer}})
            }
        }
    }

    const [search, setSearch] = useState<string>('')
    const debounced = useDebounce(search)
    const {request} = useHttp()

    const [playersSearch, setPlayersSearch] = useState<Array<IUser>>([])

    const fetchPlayersSearch = useCallback(async (debounced: string) => {
        const {rows} = await request(`/api/user/?s=${debounced}&friendOf=${newTeam.capitanId}`, 'GET')
        setPlayersSearch(rows)
    }, [newTeam])

    useEffect(() => {
        fetchPlayersSearch(debounced).catch(() => {})
    }, [debounced])

    const clearNewPlayersSearch = () => {
        setPlayersSearch([])
    }

    return {
        changeNewTeam,
        newTeam,
        setSearch,
        search,
        playersSearch,
        changeNewTeamPlayers,
        clearNewPlayersSearch,
        isUserIdIncluded,
        setNewTeam: (data: ITeam) => {
            reduceNewTeam({type: 'update', data})
        },
        reduceNewTeam
    }
}