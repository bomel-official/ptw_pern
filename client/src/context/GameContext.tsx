import { createContext, Dispatch, SetStateAction } from "react";

function noop() {}

export type IGame = "warzone" | "dota2" | null // CSGO Hidden
export type IGameOnly = "warzone" | "dota2"

interface IGameContext {
    game: IGame,
    setGame: Dispatch<SetStateAction<IGame>>
}

export const GameContext = createContext<IGameContext>( {
    game: null,
    setGame: noop
} );
