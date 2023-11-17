import {icons} from "./PlatformIcons";

export type PlatformIds = 'pc' | 'playstation' | 'xbox'
export type DeviceIds = 'km' | 'gamepad'

export const Platforms: Record<PlatformIds, {id: PlatformIds, icon: string, name: string}> = {
    'pc': {
        id: 'pc',
        icon: icons['pc'],
        name: 'Компьютер'
    },
    'playstation': {
        id: 'playstation',
        icon: icons['playstation'],
        name: 'Playstation',
    },
    'xbox': {
        id: 'xbox',
        icon: icons['xbox'],
        name: 'XBOX'
    }
}

export const Devices: Record<DeviceIds, {id: DeviceIds, icon: string, name: string}> = {
    'km': {
        id: 'km',
        icon: icons['km'],
        name: 'Клавиатура и мышь'
    },
    'gamepad': {
        id: "gamepad",
        icon: icons['gamepad'],
        name: 'Геймпад'
    }
}