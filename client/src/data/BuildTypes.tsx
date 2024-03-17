export type IBuildType = 'all' | 'own' | 'admin'

export const BuildTypes: Record<string, {id: IBuildType, name: string}> = {
    'admin': {
        id: 'admin',
        name: 'Warzone Meta'
    },
    'all': {
        id: 'all',
        name: 'Сборки сообщества'
    },
    'own': {
        id: 'own',
        name: 'Ваши сборки'
    },
}