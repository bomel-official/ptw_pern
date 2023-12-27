import {useCallback, useEffect, useState} from "react";
import {useDebounce} from "./debounce.hook";

import {ITeam, IUser} from "../StoreTypes";
import {useHttp} from "./http.hook";

export const initNewTeam: ITeam = {
    id: null,
    name: null,
    avatar: null,
    avatar_path: null,
    capitanId: null,
    players: []
}

export const useNewTeam = () => {
    const [newTeam, setNewTeam] = useState(initNewTeam)

    const changeNewTeam = (name: string | null, value: any) => {
        if (name === 'avatar') {
            if (FileReader && value) {
                let fr = new FileReader();
                fr.onload = function () {
                    if (typeof fr.result === 'string') {
                        setNewTeam({...newTeam, [name]: value, avatar_path: fr.result})
                    } else {
                        setNewTeam({...newTeam, [name]: value})
                    }
                }
                fr.readAsDataURL(value);
            }
        } else if (name && name in newTeam) {
            setNewTeam({...newTeam, [name]: value})
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
            changeNewTeam('players', newTeam.players.filter((player: IUser) => player.id !== requestPlayer.id))
        } else if (action === 'add') {
            if (!isUserIdIncluded(requestPlayer.id)) {
                changeNewTeam('players', [...newTeam.players, requestPlayer])
            }
        }
    }

    const [search, setSearch] = useState<string>('')
    const debounced = useDebounce(search)
    const {request} = useHttp()

    const [playersSearch, setPlayersSearch] = useState<Array<IUser>>([])

    const fetchPlayersSearch = useCallback(async (debounced: string) => {
        const {rows} = newTeam.capitanId ? await request(`/api/user/?s=${debounced}&friendOf=${newTeam.capitanId}`, 'GET') : await request(`/api/user/?s=${debounced}`, 'GET')
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
        setNewTeam,
    }
}