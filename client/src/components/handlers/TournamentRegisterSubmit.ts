import {IMessageOptions, IParticipant, ITeam, IUser} from "../../StoreTypes";
import {Dispatch} from "react";
import {SaveTeam} from "./SaveTeam";

export const TournamentRegisterSubmit = async (
    newTeamUsed: any,
    tournamentRegistrationUsed: any,
    clearError: () => void,
    token: string | null,
    request: (url: string, method?: string, body?: any, headers?: Record<string, string>, isJson?: boolean) => Promise<any>,
    setMessageOptions: Dispatch<IMessageOptions>,
    refetchHandler: Dispatch<boolean>
): Promise<{isOk: boolean, url: string}> => {
    clearError()
    try {
        let {team} = await SaveTeam(newTeamUsed.newTeam, request, token)

        if (!team) {
            return {isOk: false, url: ''}
        }

        newTeamUsed.changeNewTeam('id', team.id)

        const {isOk, url} = await request(`/api/tournament/register`, 'POST', {
            teamId: team.id,
            tournamentId: tournamentRegistrationUsed.registerRequest.tournamentId,
            players: tournamentRegistrationUsed.registerRequest.players.map((pl: IUser) => pl.id),
            id: tournamentRegistrationUsed.registerRequest.id ?? '',
            payMethod: tournamentRegistrationUsed.registerRequest.payMethod
        }, {
            Authorization: `Bearer ${token}`
        }, true)
        if (isOk) {
            setMessageOptions({
                status: 'pos', text: 'Вы зарегистрировалиь!!'
            })
            refetchHandler(true)
            return {isOk: true, url}
        }
    } catch (e) {}
    return {isOk: false, url: ''}
}