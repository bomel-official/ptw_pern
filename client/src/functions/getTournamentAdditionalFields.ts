import {ITournament, IUser} from "../StoreTypes";

export const getTournamentAdditionalFields = (tournament: ITournament | null | undefined, user?: IUser | null | undefined): {amountPlayers: number, isUserRegistered: boolean, slots: number} => {
    const amountPlayers: number = (tournament) ? Math.max(tournament.players.length, tournament.participantsList.length) : 0
    const slots: number = (tournament) ? Math.floor(tournament.maxUsers / tournament.playersInTeam) - Math.floor(amountPlayers / tournament.playersInTeam) : 0

    let isUserRegistered: boolean = false
    if (user && tournament) {
        for (const player of tournament.players) {
            if (player.id === user.id) {
                isUserRegistered = true
            }
        }
    }

    return {amountPlayers, isUserRegistered, slots}
}