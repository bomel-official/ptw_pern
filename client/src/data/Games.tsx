import WZTab from "../static/icons/warzone.png";
import CSGOTab from "../static/icons/csgo.png";
import {IGameOnly} from "../context/GameContext";

export type IGameObject = {name: string, icon: string, id: IGameOnly}

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