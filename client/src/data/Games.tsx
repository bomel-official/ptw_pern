import { IGameOnly } from "../context/GameContext";
import Dota2Icon from "../static/icons/dota2.svg";
import MW2Icon from "../static/icons/mw2.svg";
import MW3Icon from "../static/icons/mw3.svg";
import WZTab from "../static/icons/warzone.png";

import WZIcon from "../static/icons/wz.svg";

export type IGameOnlyVersion = "mw2" | "mw3" | "wz"

export type IGameObject = { name: string, icon: string, id: IGameOnly }
export type IGameVersionObject = { name: string, icon: string, id: IGameOnlyVersion }

export const Games: Record<IGameOnly, IGameObject> = {
    "warzone": {
        id: "warzone",
        name: "Warzone",
        icon: WZTab
    },
    // 'csgo': {
    //     id: 'csgo',
    //     name: 'CSGO',
    //     icon: CSGOTab
    // },
    "dota2": {
        id: "dota2",
        name: "Dota 2",
        icon: Dota2Icon
    }
};

export const GameVersions: Record<any, IGameVersionObject> = {
    "wz": {
        id: "wz",
        name: "Warzone",
        icon: WZIcon
    },
    "mw2": {
        id: "mw2",
        name: "Modern Warfare 2",
        icon: MW2Icon
    },
    "mw3": {
        id: "mw3",
        name: "Modern Warfare 3",
        icon: MW3Icon
    }
};
