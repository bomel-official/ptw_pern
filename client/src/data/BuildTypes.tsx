export type IBuildType = 'all' | 'own'

export const BuildTypes: Array<{id: IBuildType, name: string}> = [
    {
        id: 'all',
        name: 'Сборки сообщества'
    },
    {
        id: 'own',
        name: 'Ваши сборки'
    }
]