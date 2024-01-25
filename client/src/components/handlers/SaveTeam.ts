import {ITeam, IUser} from "../../StoreTypes";

export const SaveTeam = async (
    team: ITeam,
    request: (url: string, method?: string, body?: any, headers?: Record<string, string>, isJson?: boolean,) => Promise<any>,
    token: string | null
): Promise<{team: ITeam | null, message: string}> => {

    const formData = new FormData()
    if (team.id) {
        formData.set('id', JSON.stringify(team.id || ''))
    }
    formData.set('avatar', team.avatar || '')
    formData.set('capitanId', JSON.stringify(team.capitanId || ''))
    formData.set('name', team.name || '')
    formData.set('players', JSON.stringify(team.players.map((player: IUser) => (player.id))))

    const {team: savedTeam, message} = await request(`/api/team/save-create`, 'POST', formData, {
        Authorization: `Bearer ${token}`
    }, false)

    if (!savedTeam) {
        return {team: null, message: 'Ошибка...'}
    }
    return {team: savedTeam, message}
}