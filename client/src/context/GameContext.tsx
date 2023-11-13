import {createContext, Dispatch, SetStateAction} from "react";

function noop() {}

export type IGame = 'warzone' | null // CSGO Hidden
export type IGameOnly = 'warzone'

interface IGameContext {
    game: IGame,
    setGame: Dispatch<SetStateAction<IGame>>
}

export const GameContext = createContext<IGameContext>({
    game: null,
    setGame: noop
})