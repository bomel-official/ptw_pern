import {createContext, Dispatch, SetStateAction} from "react";

function noop() {}

export type IGame = 'warzone' | 'csgo' | null
export type IGameOnly = 'warzone' | 'csgo'

interface IGameContext {
    game: IGame,
    setGame: Dispatch<SetStateAction<IGame>>
}

export const GameContext = createContext<IGameContext>({
    game: null,
    setGame: noop
})