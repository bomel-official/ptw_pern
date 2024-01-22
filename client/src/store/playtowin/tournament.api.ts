import {ITournament} from "../../StoreTypes";

export const getTournamentBySlug = {
    query: (slug: string) => ({
        url: `tournament/${slug}`
    }),
    transformResponse: (response: {tournament: ITournament}) => response.tournament
}