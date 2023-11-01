import React, {useContext, useEffect, useState} from 'react';
import {_f, __} from "../../multilang/Multilang";
import Select from "../base/Select";
import {Games, IGameObject} from "../../data/Games";
import {IMessageOptions, ITournament} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";


const newTournamentTemplate = {
    id: null,
    title_RU: null,
    title_EU: null,
    game: null,
    type: 'tournament',
    isRegisterOn: true,
    twitchChannel: null,
    dateBegin: null,
    dateEnd: null,
    previewImg: null,
    maxUsers: null,
    playersInTeam: null,
    participationPrice: null,
    prizes: null,
    prize_1: null,
    prize_2: null,
    prize_3: null,
    format_RU: null,
    format_EU: null,
    descRules_RU: null,
    descRules_EU: null,
    descAdditional_RU: null,
    descAdditional_EU: null,
}

const AdminTournamentCreate = ({tournament = newTournamentTemplate}: {tournament?: any}) => {
    const [newTournament, setNewTournament] = useState(tournament)

    const changeTournamentField = (key: string, value: string|number|null|File|boolean) => {
        setNewTournament({...newTournament, [key]: value})
    }
    const getTournamentEditor = (key: string) => {
        return (value: string|number|null) => {
            setNewTournament({...newTournament, [key]: value})
        }
    }

    const auth = useContext(AuthContext)
    const {loading, request, error, clearError} = useHttp()
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const formData = new FormData()

    const createHandler = async (event: any) => {
        event.preventDefault()
        clearError()
        let requestUrl = null
        if (newTournament.id !== null) {
            requestUrl = '/api/tournament/edit'
        } else {
            requestUrl = '/api/tournament/create'
        }
        try {
            for (let key in newTournament) {
                if (newTournament.hasOwnProperty(key)) {
                    formData.set(key, newTournament[key])
                }
            } // add data to formData from form state
            const {message} = await request(requestUrl, 'POST', formData, {
                Authorization: `Bearer ${auth.token}`
            }, false)
            setMessageOptions({
                status: 'pos', text: message
            })
        } catch (e) {}
    }

    return (
        <form onSubmit={createHandler} action={"null"} method="POST">
            <h2 className="profile__heading mb12">{tournament.id ? __('Редактировать') + ': ' + _f(newTournament, 'title') : __('Создать турнир')}</h2>
            <div className="build__data-block">
                <p className="build__label">{__("Основное")}</p>
                <div className="build__grid-row">
                    <label htmlFor="title_RU" className="input-tl">
                        <input
                            type="text"
                            name="title_RU"
                            placeholder={__("Название турнира RU")}
                            required={true}
                            onChange={e => changeTournamentField('title_RU', e.target.value)}
                            value={newTournament.title_RU ? newTournament.title_RU : ''}
                        />
                    </label>
                    <label htmlFor="title_EU" className="input">
                        <input
                            type="text"
                            name="title_EU"
                            placeholder={__("Название турнира EU")}
                            required={true}
                            onChange={e => changeTournamentField('title_EU', e.target.value)}
                            value={newTournament.title_EU ? newTournament.title_EU : ''}
                        />
                    </label>
                </div>
                <div className="build__grid-row">
                    <label htmlFor="format_RU" className="input">
                        <input
                            type="text"
                            name="format_RU"
                            placeholder={__("Формат RU")}
                            required={true}
                            onChange={e => changeTournamentField('format_RU', e.target.value)}
                            value={newTournament.format_RU ? newTournament.format_RU : ''}
                        />
                    </label>
                    <label htmlFor="format_EU" className="input">
                        <input
                            type="text"
                            name="format_EU"
                            placeholder={__("Формат EU")}
                            required={true}
                            onChange={e => changeTournamentField('format_EU', e.target.value)}
                            value={newTournament.format_EU ? newTournament.format_EU : ''}
                        />
                    </label>
                </div>
                <div className="build__grid-row">
                    <Select
                        options={Object.values(Games).map((game: IGameObject) => ({value: game.id, text: game.name}))}
                        changeValue={getTournamentEditor('game')}
                        defaultText={newTournament.game ? newTournament.game : "Выберите игру"}
                        defaultValue={newTournament.game}
                    />
                    <Select
                        options={[
                            {
                                value: 'tournament',
                                text: 'Турнир'
                            },
                            {
                                value: 'hub',
                                text: 'Хаб'
                            }
                        ]}
                        changeValue={getTournamentEditor('type')}
                        defaultText={newTournament.type ? newTournament.type : "Выберите тип"}
                        defaultValue={newTournament.type}
                    />
                </div>
                <div className="build__grid-row">
                    <label htmlFor="participationPrice" className="input">
                        <input
                            type="number"
                            name="participationPrice"
                            placeholder={__("Плата за участие (Points)")}
                            onChange={e => changeTournamentField('participationPrice', e.target.value)}
                            value={newTournament.participationPrice ? newTournament.participationPrice : '0'}
                        />
                    </label>
                    <label htmlFor="maxUsers" className="input">
                        <input
                            type="number"
                            name="maxUsers"
                            placeholder={__("Максимум участников")}
                            required={true}
                            onChange={e => changeTournamentField('maxUsers', e.target.value)}
                            value={newTournament.maxUsers ? newTournament.maxUsers : ''}
                        />
                    </label>
                    <label htmlFor="playersInTeam" className="input-br">
                        <input
                            type="number"
                            name="playersInTeam"
                            placeholder={__("Игроков в команде")}
                            required={true}
                            onChange={e => changeTournamentField('playersInTeam', e.target.value)}
                            value={newTournament.playersInTeam ? newTournament.playersInTeam : ''}
                        />
                    </label>
                </div>
            </div>
            <div className="build__data-block">
                <p className="build__label">{__("Дата начала и конца")}</p>
                <div className="build__grid-row">
                    <label htmlFor="dateBegin" className="input-tl">
                        <input
                            type="datetime-local"
                            name="dateBegin"
                            placeholder={__("Дата начала")}
                            required={true}
                            onChange={e => changeTournamentField('dateBegin', e.target.value)}
                            value={newTournament.dateBegin ? new Date(newTournament.dateBegin).toISOString().slice(0, -1) : ''}
                        />
                    </label>
                    <label htmlFor="dateEnd" className="input-br">
                        <input
                            type="datetime-local"
                            name="dateEnd"
                            placeholder={__("Дата конца")}
                            required={true}
                            onChange={e => changeTournamentField('dateEnd', e.target.value)}
                            value={newTournament.dateEnd ? new Date(newTournament.dateEnd).toISOString().slice(0, -1) : ''}
                        />
                    </label>
                </div>
            </div>
            <div className="build__data-block">
                <p className="build__label">{__("Общая информация")}</p>
                <div className="build__grid-row">
                    <label htmlFor={`${newTournament.id ? newTournament.id : ''}previewImg`} className="input-tl fileInput" style={{justifyContent: 'flex-start', paddingLeft: '8px', paddingRight: '8px'}}>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="fileInput__text">{newTournament.previewImg ? newTournament.previewImg.name || newTournament.previewImg : __('Изображение')}</span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            name="previewImg"
                            placeholder={__("Изображение")}
                            id={`${newTournament.id ? newTournament.id : ''}previewImg`}
                            onChange={e => changeTournamentField('previewImg', e.target.files ? e.target.files[0] : null )}
                        />
                    </label>
                    <label htmlFor="twitchChannel" className="input">
                        <input
                            type="text"
                            name="twitchChannel"
                            placeholder={__("Ссылка на Twitch")}
                            required={true}
                            onChange={e => changeTournamentField('twitchChannel', e.target.value)}
                            value={newTournament.twitchChannel ? newTournament.twitchChannel : ''}
                        />
                    </label>
                </div>
                <div className="build__grid-row">
                    <label htmlFor="descRules_RU" className="input" style={{height: 'auto', minHeight: '64px'}}>
                        <textarea
                            name="descRules_RU"
                            id=""
                            placeholder="Правила RU"
                            required={true}
                            onChange={e => changeTournamentField('descRules_RU', e.target.value)}
                            defaultValue={newTournament.descRules_RU ? newTournament.descRules_RU : ''}
                        ></textarea>
                    </label>
                    <label htmlFor="descRules_EU" className="input" style={{height: 'auto', minHeight: '64px'}}>
                        <textarea
                            name="descRules_EU"
                            id=""
                            placeholder="Правила EU"
                            required={true}
                            onChange={e => changeTournamentField('descRules_EU', e.target.value)}
                            defaultValue={newTournament.descRules_EU ? newTournament.descRules_EU : ''}
                        ></textarea>
                    </label>
                </div>
                <div className="build__grid-row">
                    <label htmlFor="descAdditional_RU" className="input" style={{height: 'auto', minHeight: '64px'}}>
                        <textarea
                            name="descAdditional_RU"
                            id=""
                            placeholder="Дополнительные сведения RU"
                            required={true}
                            onChange={e => changeTournamentField('descAdditional_RU', e.target.value)}
                            defaultValue={newTournament.descAdditional_RU ? newTournament.descAdditional_RU : ''}
                        ></textarea>
                    </label>
                    <label htmlFor="descAdditional_EU" className="input-br" style={{height: 'auto', minHeight: '64px'}}>
                        <textarea
                            name="descAdditional_EU"
                            id=""
                            placeholder="Дополнительные сведения EU"
                            required={true}
                            onChange={e => changeTournamentField('descAdditional_EU', e.target.value)}
                            defaultValue={newTournament.descAdditional_EU ? newTournament.descAdditional_EU : ''}
                        ></textarea>
                    </label>
                </div>
            </div>
            <div className="build__data-block">
                <p className="build__label">{__("Призовой фонд")}</p>
                <div className="build__grid-row">
                    <label htmlFor="prizes" className="input-tl">
                        <input
                            type="number"
                            name="prizes"
                            placeholder={__("Призовой фонд (₽)")}
                            required={true}
                            onChange={e => changeTournamentField('prizes', e.target.value)}
                            value={newTournament.prizes ? newTournament.prizes : ''}
                        />
                    </label>
                    <label htmlFor="prize_1" className="input">
                        <input
                            type="number"
                            name="prize_1"
                            placeholder={__("За 1 место (₽)")}
                            required={true}
                            onChange={e => changeTournamentField('prize_1', e.target.value)}
                            value={newTournament.prize_1 ? newTournament.prize_1 : ''}
                        />
                    </label>
                </div>
                <div className="build__grid-row">
                    <label htmlFor="prize_2" className="input">
                        <input
                            type="number"
                            name="prize_2"
                            placeholder={__("За 2 место (₽)")}
                            required={true}
                            onChange={e => changeTournamentField('prize_2', e.target.value)}
                            value={newTournament.prize_2 ? newTournament.prize_2 : ''}
                        />
                    </label>
                    <label htmlFor="prize_3" className="input-br">
                        <input
                            type="number"
                            name="prize_3"
                            placeholder={__("За 3 место (₽)")}
                            required={true}
                            onChange={e => changeTournamentField('prize_3', e.target.value)}
                            value={newTournament.prize_3 ? newTournament.prize_3 : ''}
                        />
                    </label>
                </div>
            </div>
            <div className="build__data-block">
                <p className="build__label">{__("Регистрация")}</p>
                <label className={newTournament.isRegisterOn ? "admin__checkbox active" : "admin__checkbox"} onClick={e => changeTournamentField('isRegisterOn', !(newTournament.isRegisterOn))}>
                    <span className="admin__checkbox-rect"></span>
                    <span className="admin__checkbox-label">{__(newTournament.isRegisterOn ? "Выключить регистрацию" : "Включить регистрацию")}</span>
                </label>
            </div>
            { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
            <div className="admin__submit-wrapper pt12">
                <button className="button-both-accent corner-margin">{__("Сохранить")}</button>
            </div>
        </form>
    );
};

export default AdminTournamentCreate;