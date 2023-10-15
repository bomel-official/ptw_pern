
export type ITournamentsTabsOnly = 'about' | 'participants' | 'rating' | 'rules'

export const TournamentTabs: Record<string, {slug: string, text: string}> = {
    'about': {
        slug: 'about',
        text: 'О турнире'
    },
    'participants': {
        slug: 'participants',
        text: 'Участники'
    },
    'rating': {
        slug: 'rating',
        text: 'Рейтинг'
    },
    'rules': {
        slug: 'rules',
        text: 'Правила турнира'
    }
}