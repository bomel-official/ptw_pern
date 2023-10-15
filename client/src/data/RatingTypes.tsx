export type IRatingType = 'team' | 'player'

export const RatingTypes: Record<IRatingType, {lowerName: string, upperName: string, id: IRatingType}> = {
    'team': {
        lowerName: 'команд',
        upperName: 'Командный',
        id: 'team'
    },
    'player': {
        lowerName: 'игроков',
        upperName: 'Персональный',
        id: 'player'
    }
}