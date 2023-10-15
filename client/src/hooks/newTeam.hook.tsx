import {useCallback, useEffect, useState} from "react";
import {useDebounce} from "./debounce.hook";

import PIC from '../static/icons/PIC.jpg'
import {ITeam, IUser} from "../StoreTypes";

export const initNewTeam: ITeam = {
    id: null,
    name: null,
    avatar: null,
    avatar_path: null,
    capitan: null,
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

    const [playersSearch, setPlayersSearch] = useState<Array<IUser>>([])

    useEffect(() => {
        // Request
        const newPlayersSearch = [
            {avatar: PIC, nickname: 'user1', id: 0, role: 'USER', friends: []},
            {avatar: PIC, nickname: 'user2', id: 1, role: 'USER', friends: []},
            {avatar: PIC, nickname: 'user3', id: 2, role: 'USER', friends: []},
            {avatar: PIC, nickname: 'user4', id: 3, role: 'USER', friends: []},
            {avatar: PIC, nickname: 'user5', id: 4, role: 'USER', friends: []}
        ]
        if (debounced.length > 0) {
            setPlayersSearch(newPlayersSearch.filter((player) => player.nickname.includes(debounced)))
        } else {
            setPlayersSearch([])
        }
        // request end
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
        setNewTeam
    }
}