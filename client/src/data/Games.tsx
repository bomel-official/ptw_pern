import WZTab from "../static/icons/warzone.png";
import CSGOTab from "../static/icons/csgo.png";
import {IGameOnly} from "../context/GameContext";

export type IGameOnlyVersion = 'mw2' | 'mw3' | 'wz'

export type IGameObject = {name: string, icon: string, id: IGameOnly}
export type IGameVersionObject = {name: string, icon: string, id: IGameOnlyVersion}

export const Games: Record<IGameOnly, IGameObject> = {
    'warzone': {
        id: 'warzone',
        name: 'Warzone',
        icon: WZTab
    },
    'csgo': {
        id: 'csgo',
        name: 'CSGO',
        icon: CSGOTab
    }
}

export const GameVersions: Record<any, IGameVersionObject> = {
    'wz': {
        id: 'wz',
        name: 'Warzone',
        icon: WZTab
    },
    'mw2': {
        id: 'mw2',
        name: 'Modern Warfare 2',
        icon: WZTab
    },
    'mw3': {
        id: 'mw3',
        name: 'Modern Warfare 3',
        icon: CSGOTab
    }
}