import {icons} from "./PlatformIcons";

export type PlatformIds = 'pc' | 'playstation' | 'xbox'

export const Platforms: Record<PlatformIds, {id: PlatformIds, icon: string, name: string}> = {
    'pc': {
        id: 'pc',
        icon: icons['pc'],
        name: 'Компьютер'
    },
    'playstation': {
        id: 'playstation',
        icon: icons['playstation'],
        name: 'Playstation'
    },
    'xbox': {
        id: 'xbox',
        icon: icons['xbox'],
        name: 'XBOX'
    }
}