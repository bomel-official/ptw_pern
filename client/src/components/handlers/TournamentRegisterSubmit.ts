import {IMessageOptions, IParticipant, ITeam, IUser} from "../../StoreTypes";
import {Dispatch} from "react";

export const TournamentRegisterSubmit = async (
    newTeamUsed: any,
    tournamentRegistrationUsed: any,
    clearError: () => void,
    token: string | null,
    request: (url: string, method?: string, body?: any, headers?: Record<string, string>, isJson?: boolean) => Promise<any>,
    setMessageOptions: Dispatch<IMessageOptions>,
    refetchHandler: Dispatch<boolean>
) => {
    clearError()
    const formData = new FormData()
    try {
        let teamId = newTeamUsed.newTeam.id
        if (teamId === null) {
            formData.set('avatar', newTeamUsed.newTeam.avatar)
            formData.set('capitanId', newTeamUsed.newTeam.capitanId)
            formData.set('name', newTeamUsed.newTeam.name)
            formData.set('players', JSON.stringify(newTeamUsed.newTeam.players.map((player: IUser) => (player.id))))

            const {team} = await request(`/api/team/save-create`, 'POST', formData, {
                Authorization: `Bearer ${token}`
            }, false)
            if (!team) {
                return false
            }
            teamId = team.id
            newTeamUsed.changeNewTeam('id', team.id)
        }
        const {isOk} = await request(`/api/tournament/register`, 'POST', {
            teamId: teamId,
            tournamentId: tournamentRegistrationUsed.registerRequest.tournamentId,
            players: tournamentRegistrationUsed.registerRequest.players.map((pl: IUser) => pl.id),
            id: tournamentRegistrationUsed.registerRequest.id ?? ''
        }, {
            Authorization: `Bearer ${token}`
        }, true)
        if (isOk) {
            setMessageOptions({
                status: 'pos', text: 'Вы зарегистрировалиь!!'
            })
            refetchHandler(true)
            return true
        }
    } catch (e) {}
    return false
}