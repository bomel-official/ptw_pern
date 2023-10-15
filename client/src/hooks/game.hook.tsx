import {useEffect, useState} from "react";
import {IGame} from "../context/GameContext";


const storageName = 'userGame'

interface IStorageGame {
    currentGame: IGame
}

export const useGame = () => {
    const [game, setGame] = useState<IGame>(null)

    useEffect(() => {
        const storageGame: IStorageGame = JSON.parse(localStorage.getItem(storageName) || '{}')
        if (storageGame && storageGame.currentGame) {
            setGame(storageGame.currentGame)
        } else {
            setGame('warzone')
        }
    }, [])


    useEffect(() => {
        if (game !== null) {
            const newStorageGame: IStorageGame = {
                currentGame: game
            }
            localStorage.setItem(storageName, JSON.stringify(newStorageGame))
        }
    }, [game])

    return {game, setGame}
}