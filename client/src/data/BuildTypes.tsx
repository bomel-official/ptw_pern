export type IBuildType = 'all' | 'own'

export const BuildTypes: Record<string, {id: IBuildType, name: string}> = {
    'all': {
        id: 'all',
        name: 'Сборки сообщества'
    },
    'own': {
        id: 'own',
        name: 'Ваши сборки'
    }
}