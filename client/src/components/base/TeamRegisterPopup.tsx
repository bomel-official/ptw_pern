import React, {ChangeEvent, Dispatch, useCallback, useContext, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import {icons} from "../../data/PlatformIcons";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {Popup} from "./Popup";
import {IMessageOptions, ITeam, ITournament, IUser} from "../../StoreTypes";
import {getFile} from "../../functions/getFile";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/http.hook";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";
import {isUserAdmin} from "../../functions/isUserAdmin";
import {TournamentRegisterSubmit} from "../handlers/TournamentRegisterSubmit";
import {useTournamentRegistration} from "../../hooks/tournamentRegistration.hook";
import Loader from "./Loader";
import getPayPalText from "../../functions/getPayPalText";
import PayPalData from "../../data/PayPalData";

const TeamRegisterPopup = ({tournament, isRegisterFormActive, setIsRegisterFormActive, refetchHandler}: {
    tournament: ITournament | null | undefined,
    isRegisterFormActive: boolean,
    setIsRegisterFormActive: Dispatch<boolean>,
    refetchHandler: Dispatch<boolean>
}) => {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [teams, setTeams] = useState<Array<ITeam>>([])
    const {user, token} = useContext(AuthContext)
    const {request, error, clearError} = useHttp()
    const [isLoading, setIsLoading] = useState(false)

    const newTeamUsed = useNewTeam()
    const tournamentRegistrationUsed = useTournamentRegistration()

    const {
        newTeam,
        changeNewTeam,
        setSearch,
        search,
        playersSearch,
        changeNewTeamPlayers,
        clearNewPlayersSearch,
        isUserIdIncluded,
        setNewTeam,
    } = newTeamUsed

    const {
        isUserIdIncludedInRequest,
        changeRequestPlayers,
        registerRequest,
        setRegisterRequest,
        changeRegisterForm
    } = tournamentRegistrationUsed

    const fetchCurrentParticipant = async () => {
        const {participant, participantUsers} = await request(`/api/tournament/get-own-participant?tournamentId=${tournament?.id}&userId=${user?.id}`, 'GET')
        if (participant && participantUsers) {
            setNewTeam({
                avatar: participant.team.avatar,
                capitanId: participant.team.capitanId,
                players: participant.team.players,
                name: participant.team.name,
                id: participant.team.id,
                avatar_path: null
            })
            setRegisterRequest({
                teamId: participant.teamId,
                tournamentId: participant.tournamentId,
                players: participantUsers,
                id: participant.id,
                capitan: participant.capitan,
                payMethod: participant.payMethod
            })
        }
    }

    const fetchTeams = useCallback(async () => {
        if (user && isUserAdmin(user)) {
            const {rows} = await request(`/api/team/search?type=all`, 'GET')
            setTeams(rows)
        } else if (user && user.id) {
            const {rows} = await request(`/api/team/search?userId=${user.id}&type=own`, 'GET')
            setTeams(rows)
        }
    }, [user])

    const unregisterParticipant = async () => {
        if (tournament && registerRequest.id) {
            const {isOk} = await request(`/api/tournament/unregister`, 'POST', {
                tournamentId: tournament.id,
                participantId: registerRequest.id
            }, {
                Authorization: `Bearer ${token}`
            }, true)
            if (isOk) {
                setNewTeam(initNewTeam)
                setRegisterRequest({
                    teamId: null,
                    tournamentId: null,
                    players: [],
                    capitan: null,
                    payMethod: 'paypal'
                })
                refetchHandler(true)
                setIsRegisterFormActive(false)
            }
            return isOk
        }
        return false
    }

    useEffect(() => {
        fetchTeams().catch()
    }, [fetchTeams, user])

    useEffect(() => {
        if (tournament && user && !isUserAdmin(user)) {
            fetchCurrentParticipant().catch(e => {})
        }
    }, [tournament, user])

    useEffect(() => {
        if (user && !isUserAdmin(user)) {
            if (!newTeam.capitanId) {
                setNewTeam({...newTeam, players: [user], capitanId: user.id})
            }
            if (!registerRequest.capitan) {
                setRegisterRequest({...registerRequest, players: [user], capitan: user.id})
            }
        }
    }, [newTeam, user, registerRequest])

    useEffect(() => {
        if (tournament && tournament.id) {
            changeRegisterForm('tournamentId', tournament.id)
        }
    }, [tournament])

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])


    return (
        <Popup
            isActive={isRegisterFormActive}
            onHide={() => setIsRegisterFormActive(false)}
            title={__('Принять участие')}
        >
            <div className="popup__smallText mb8">
                { currentStep === 0 && __('Шаг 1. Выбор команды')}
                { currentStep === 1 && __('Шаг 2. Создание команды')}
                { currentStep === 2 && __('Шаг 3. Создание команды')}
                { currentStep === 3 && __('Шаг 4. Сбор состава')}
                { tournament && tournament.participationPrice && currentStep === 4 && __('Шаг 5. Метод оплаты')}
            </div>
            <div className="popup__progressbar mb12">
                <div className="popup__progressbar-value" style={{width: `${(currentStep / 5 * 100).toFixed(2)}%`}}></div>
            </div>
            { currentStep === 0 &&
                <>
                    {!!teams.length && <div className="dropdown mb24">
                        <label
                            className="dropdown__current"
                            onClick={() => setIsDropdownActive(!isDropdownActive)}
                        >
                            {newTeam.id && <div className="profileCard">
                                <img src={getFile(newTeam.avatar) || DefaultUserPic} alt={newTeam.name || 'Team avatar'}
                                     className="profileCard__avatar"/>
                                <div className="profileCard__top">
                                    <span className="profileCard__nickname">{newTeam.name}</span>
                                </div>
                            </div>}
                            {!newTeam.id &&<span>{__('Выберите команду')}</span>}
                        </label>
                        <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                            {teams.map((team: ITeam) => (
                                <li className="dropdown__value" key={team.id}>
                                    <button
                                        onClick={() => {
                                            setNewTeam(team)
                                            setIsDropdownActive(!isDropdownActive)
                                            setCurrentStep(3)
                                        }}
                                    >
                                        <div className="profileCard">
                                            <img src={getFile(team.avatar) || DefaultUserPic} alt={team.name || 'Team avatar'}
                                                 className="profileCard__avatar"/>
                                            <div className="profileCard__top">
                                                <span className="profileCard__nickname">{team.name}</span>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>}
                    {(teams.length < 5 || (user && isUserAdmin(user))) && <button
                        className="button-both-accent popup__accentButton"
                        onClick={() => {
                            setNewTeam(initNewTeam)
                            setCurrentStep(currentStep + 1)
                        }}
                    >
                        <span>{__('Создать новую команду')}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white"
                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>}
                    {(registerRequest.id !== undefined) && <button
                        className="popup__accentButton side__top-unregister"
                        onClick={() => unregisterParticipant()}
                        style={{
                            marginTop: '8px'
                        }}
                    >
                        <span>{__('Покинуть турнир')}</span>
                    </button>}
                </>
            }
            { currentStep === 1 &&
                <>
                    <label htmlFor="teamName" className="input-tl mb12">
                        <input
                            type="text"
                            name="name"
                            id="teamName"
                            placeholder={__('Введите название')}
                            value={newTeam.name || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeNewTeam(e.target.name, e.target.value)}
                        />
                    </label>
                    <label htmlFor="teamAvatarImage" className="fileInput input mb32">
                        <span className="fileInput__text">{
                            (newTeam.avatar && typeof newTeam.avatar !== 'string') ?
                                newTeam.avatar.name :
                            newTeam.avatar || __('Загрузить аватар')
                        }</span>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            name="avatar"
                            id="teamAvatarImage"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeNewTeam(
                                e.target.name,
                                (e.target.files && e.target.files.length) ? e.target.files[0] : null
                            )}
                        />
                    </label>
                    <button
                        className="button-both-accent popup__accentButton"
                        onClick={() => setCurrentStep(currentStep + 1)}
                    >
                        <span>{__('Продолжить')}</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </>
            }
            { currentStep === 2 &&
                <>
                    <div className="dropdown mb24">
                        <div className="popup__smallText mb8 c-textTransparentWhite">{__('Пользователи должны быть у вас в друзьях')}</div>
                        <label
                            className="dropdown__current"
                            onClick={() => setIsDropdownActive(!isDropdownActive)}
                        >
                            <input
                                type="text"
                                name="nickname"
                                placeholder={__('Никнейм игрока')}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                value={search}
                            />
                        </label>
                        <ul className={!!playersSearch.length ? "dropdown__values active" : "dropdown__values"}>
                            {playersSearch.map((player: IUser) => (
                                (user && player.id !== user.id && !isUserIdIncluded(player.id)) &&
                                <li className="dropdown__value" key={player.id}>
                                    <button
                                        onClick={() => {
                                            changeNewTeamPlayers(player, 'add')
                                            clearNewPlayersSearch()
                                        }}
                                    >
                                        <div className="profileCard">
                                            <img src={getFile(player.avatar) || DefaultUserPic} alt={player.nickname} className="profileCard__avatar"/>
                                            <div className="profileCard__top">
                                                <span className="profileCard__nickname">{player.nickname}</span>
                                                <img src={icons[player?.platform || 'pc']} alt="User platform"/>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {!!newTeam.players.length && <>
                        <h4 className="popup__subtitle mb12">{__('Состав команды')}</h4>
                        <ul className="popup__players mb32">
                            {newTeam.players.map((player: IUser, index: number) => (
                                <li className="popup__player" key={index}>
                                    <div className="profileCard">
                                        <img src={getFile(player.avatar) || DefaultUserPic} alt={player.nickname} className="profileCard__avatar"/>
                                        <div className="profileCard__top">
                                            <span className="profileCard__nickname">{player.nickname}</span>
                                            <img src={icons[player?.platform || 'pc']} alt="User platform"/>
                                        </div>
                                    </div>
                                    {player.id !== user?.id && <button
                                        className="popup__player-cross"
                                        onClick={() => {
                                            changeNewTeamPlayers(player, 'remove')
                                            clearNewPlayersSearch()
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="button-both-accent popup__accentButton"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            <span>{__('Продолжить')}</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </>}
                </>
            }
            { currentStep === 3 &&
                <>
                    <div className="popup__newTeam mb24">
                        <div className="rating__team">
                            <div className="rating__team-flex">
                                <div className="rating__team-images">
                                    <img src={newTeam.avatar_path || DefaultUserPic} alt="nickname"/>
                                </div>
                                <div className="rating__team-nicks">
                                    <div className="bold flex">
                                        <span>{newTeam.name}</span>
                                    </div>
                                    <div className="text flex">
                                        <span>{newTeam.players.length} {__('человек')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="popup__cross"
                            onClick={() => (newTeam.id ? setCurrentStep(0) : setCurrentStep(1))}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.1667 1.66666L17.5 4.99999M17.5 4.99999L14.1667 8.33332M17.5 4.99999H5.83333C4.94928 4.99999 4.10143 5.35118 3.47631 5.9763C2.85119 6.60142 2.5 7.44927 2.5 8.33332V9.16666M5.83333 18.3333L2.5 15M2.5 15L5.83333 11.6667M2.5 15H14.1667C15.0507 15 15.8986 14.6488 16.5237 14.0237C17.1488 13.3986 17.5 12.5507 17.5 11.6667V10.8333" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    {!!newTeam.players.length && <>
                        <h4 className="popup__subtitle flex mb12">
                            <span className="mr-auto">{__('Выберите участников турнира')}</span>
                            <span className="white-text">{registerRequest.players.length}</span>
                            <span className="white-hoverText">/{tournament?.playersInTeam || 3}</span>
                        </h4>
                        <ul className="popup__players mb32">
                            {newTeam.players.map((player: IUser, index: number) => (
                                <li className="popup__player" key={index}>
                                    <div className="profileCard mr-auto">
                                        <img src={getFile(player.avatar) || DefaultUserPic} alt={player.nickname} className="profileCard__avatar"/>
                                        <div className="profileCard__top">
                                            <span className="profileCard__nickname">{player.nickname}</span>
                                            <img src={icons[user?.platform || 'pc']} alt="User platform"/>
                                        </div>
                                    </div>
                                    {((player.id !== user?.id) || isUserAdmin(user)) && <button
                                        className={isUserIdIncludedInRequest(player.id) ? "checkbox active" : "checkbox"}
                                        onClick={() => {
                                            changeRequestPlayers(player, tournament?.playersInTeam || 3)
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>}
                                </li>
                            ))}
                        </ul>
                        { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
                        { tournament && !tournament.participationPrice && !isLoading && <button
                            className="button-both-accent popup__accentButton"
                            onClick={async () => {
                                setIsLoading(true)
                                const response = await TournamentRegisterSubmit(newTeamUsed, tournamentRegistrationUsed, clearError, token, request, setMessageOptions, refetchHandler)
                                setIsLoading(false)
                                if (response.isOk) {
                                    if (tournament && tournament.participationPrice && response.url) {
                                        window.location.replace(response.url)
                                    }
                                    setCurrentStep(currentStep + 1)
                                }
                            }}
                        >
                            <span>{__('Принять участие')}</span>
                        </button>}
                        { tournament && !tournament.participationPrice && isLoading && <Loader/>}
                        { tournament && tournament.participationPrice && <button
                            className="button-both-accent popup__accentButton"
                            onClick={() => setCurrentStep(currentStep + 1)}
                        >
                            <span>{__('Продолжить')}</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button> }
                    </>}
                </>
            }
            { tournament && tournament.participationPrice && currentStep === 4 &&
                <>
                    <h4 className="popup__subtitle mb12">{__('Выберите метод оплаты')}</h4>
                    <div className="popup__payMethod pb24">
                        <ul className="popup__payMethod-items">
                            <button
                                className={registerRequest.payMethod === 'paypal' ? "popup__payMethod-item active" : "popup__payMethod-item"}
                                onClick={() => {
                                    changeRegisterForm('payMethod', 'paypal')
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="339.345" viewBox="0 0 338.667 89.785"><g transform="translate(936.898 -21.779)"><path clipPath="none" d="M-828.604 39.734c-.697 0-1.289.506-1.398 1.195l-8.068 51.165a1.31 1.31 0 0 0 1.294 1.513h9.568c.696 0 1.289-.507 1.398-1.195l2.37-15.025c.108-.688.701-1.195 1.398-1.195h8.699c10.164 0 18.792-7.416 20.368-17.465 1.589-10.134-6.328-18.971-17.549-18.993zm9.301 11.422h6.96c5.73 0 7.596 3.381 7.006 7.12-.59 3.747-3.488 6.507-9.031 6.507h-7.084zm45.788 3.478c-2.416.009-5.196.504-8.317 1.804-7.159 2.984-10.597 9.151-12.057 13.647 0 0-4.647 13.717 5.852 21.253 0 0 9.737 7.255 20.698-.447l-.189 1.203a1.31 1.31 0 0 0 1.292 1.513h9.083c.697 0 1.289-.507 1.398-1.195l5.525-35.038a1.31 1.31 0 0 0-1.292-1.515h-9.083c-.697 0-1.29.507-1.398 1.195l-.297 1.886s-3.967-4.333-11.216-4.306zm.297 11.067c1.043 0 1.997.144 2.853.419 3.919 1.258 6.141 5.023 5.498 9.104-.793 5.025-4.914 8.725-10.199 8.725-1.042 0-1.996-.143-2.853-.418-3.918-1.258-6.154-5.023-5.511-9.104.793-5.025 4.927-8.727 10.212-8.727z" fill="#003087"/><path clipPath="none" d="M-697.804 39.734c-.697 0-1.289.506-1.398 1.195l-8.068 51.165a1.31 1.31 0 0 0 1.294 1.513h9.568c.696 0 1.289-.507 1.398-1.195l2.37-15.025c.108-.688.701-1.195 1.398-1.195h8.699c10.164 0 18.791-7.416 20.366-17.465 1.59-10.134-6.326-18.971-17.547-18.993zm9.301 11.422h6.96c5.73 0 7.596 3.381 7.006 7.12-.59 3.747-3.487 6.507-9.031 6.507h-7.084zm45.787 3.478c-2.416.009-5.196.504-8.317 1.804-7.159 2.984-10.597 9.151-12.057 13.647 0 0-4.645 13.717 5.854 21.253 0 0 9.735 7.255 20.697-.447l-.189 1.203a1.31 1.31 0 0 0 1.294 1.513h9.082c.697 0 1.289-.507 1.398-1.195l5.527-35.038a1.31 1.31 0 0 0-1.294-1.515h-9.083c-.697 0-1.29.507-1.398 1.195l-.297 1.886s-3.967-4.333-11.216-4.306zm.297 11.067c1.043 0 1.997.144 2.853.419 3.919 1.258 6.141 5.023 5.498 9.104-.793 5.025-4.914 8.725-10.199 8.725-1.042 0-1.996-.143-2.853-.418-3.918-1.258-6.154-5.023-5.511-9.104.793-5.025 4.927-8.727 10.212-8.727z" fill="#0070e0"/><path clipPath="none" d="M-745.92 55.859c-.72 0-1.232.703-1.012 1.388l9.958 30.901-9.004 14.562c-.437.707.071 1.62.902 1.62h10.642a1.77 1.77 0 0 0 1.513-.854l27.811-46.007c.427-.707-.083-1.611-.909-1.611h-10.641a1.77 1.77 0 0 0-1.522.869l-10.947 18.482-5.557-18.345c-.181-.597-.732-1.006-1.355-1.006z" fill="#003087"/><path clipPath="none" d="M-609.107 39.734c-.696 0-1.289.507-1.398 1.195l-8.07 51.163a1.31 1.31 0 0 0 1.294 1.515h9.568c.696 0 1.289-.507 1.398-1.195l8.068-51.165a1.31 1.31 0 0 0-1.292-1.513z" fill="#0070e0"/><path clipPath="none" d="M-908.37 39.734a2.59 2.59 0 0 0-2.556 2.185l-4.247 26.936c.198-1.258 1.282-2.185 2.556-2.185h12.445c12.525 0 23.153-9.137 25.095-21.519a20.76 20.76 0 0 0 .245-2.793c-3.183-1.669-6.922-2.624-11.019-2.624z" fill="#001c64"/><path clipPath="none" d="M-874.832 42.359a20.76 20.76 0 0 1-.245 2.793c-1.942 12.382-12.571 21.519-25.095 21.519h-12.445c-1.273 0-2.358.926-2.556 2.185l-3.905 24.752-2.446 15.528a2.1 2.1 0 0 0 2.075 2.43h13.508a2.59 2.59 0 0 0 2.556-2.185l3.558-22.567a2.59 2.59 0 0 1 2.558-2.185h7.953c12.525 0 23.153-9.137 25.095-21.519 1.379-8.788-3.047-16.784-10.611-20.75z" fill="#0070e0"/><path clipPath="none" d="M-923.716 21.779c-1.273 0-2.358.926-2.556 2.183l-10.6 67.216c-.201 1.276.785 2.43 2.077 2.43h15.719l3.903-24.752 4.247-26.936a2.59 2.59 0 0 1 2.556-2.185h22.519c4.098 0 7.836.956 11.019 2.624.218-11.273-9.084-20.58-21.873-20.58z" fill="#003087"/></g></svg>
                            </button>
                            <button
                                className={registerRequest.payMethod === 'enot' ? "popup__payMethod-item active" : "popup__payMethod-item"}
                                onClick={() => {
                                    changeRegisterForm('payMethod', 'enot')
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="144" height="115" viewBox="0 0 144 115" fill="none">
                                    <path d="M72.2402 21.9203C72.2776 26.2934 71.0173 30.5794 68.6187 34.2363C66.2201 37.8931 62.7908 40.7564 58.7647 42.4642C54.7386 44.1719 50.2965 44.6473 46.0002 43.8302C41.7039 43.0132 37.7464 40.9404 34.6283 37.874C31.5101 34.8076 29.3713 30.8853 28.4825 26.6033C27.5936 22.3213 27.9946 17.8718 29.6347 13.8177C31.2748 9.76358 34.0804 6.28691 37.6965 3.82741C41.3127 1.3679 45.577 0.0360408 49.9502 0.000277019H50.1402C55.9733 -0.028975 61.5792 2.2595 65.7253 6.36253C69.8715 10.4656 72.2185 16.0472 72.2502 21.8803L72.2402 21.9203Z" fill="#F59D1A"/>
                                    <path d="M45 21.9204C45.0373 26.2922 43.7777 30.577 41.3804 34.2332C38.983 37.8893 35.5556 40.7526 31.5312 42.4612C27.5069 44.1697 23.0663 44.6468 18.7709 43.8321C14.4754 43.0175 10.5179 40.9476 7.39863 37.8842C4.27932 34.8208 2.13825 30.9014 1.24605 26.6214C0.353849 22.3414 0.75058 17.8929 2.38609 13.8383C4.0216 9.78376 6.82247 6.30507 10.4346 3.84201C14.0468 1.37894 18.3081 0.0420707 22.68 0.000385742H22.87C25.7607 -0.0167323 28.6265 0.536039 31.3036 1.6271C33.9806 2.71817 36.4163 4.32613 38.4715 6.35907C40.5268 8.39201 42.1612 10.8101 43.2814 13.475C44.4016 16.14 44.9856 18.9996 45 21.8904V21.9204Z" fill="#E7001B"/>
                                    <path d="M36.4998 4.67041C33.8637 6.70839 31.7295 9.32329 30.2611 12.3144C28.7928 15.3055 28.0293 18.5933 28.0293 21.9254C28.0293 25.2575 28.7928 28.5453 30.2611 31.5364C31.7295 34.5275 33.8637 37.1424 36.4998 39.1804C39.136 37.1424 41.2702 34.5275 42.7386 31.5364C44.2069 28.5453 44.9704 25.2575 44.9704 21.9254C44.9704 18.5933 44.2069 15.3055 42.7386 12.3144C41.2702 9.32329 39.136 6.70839 36.4998 4.67041Z" fill="#FC5F01"/>
                                    <path d="M5.66992 54.6803H4.41992V48.8803H5.64993V49.6303C6.14868 49.2101 6.74259 48.9183 7.37992 48.7803C7.77308 48.8078 8.15556 48.9204 8.50089 49.1103C8.84622 49.3002 9.14615 49.563 9.37992 49.8803C9.59021 49.5401 9.88486 49.26 10.2353 49.0673C10.5857 48.8745 10.98 48.7757 11.3799 48.7803C11.9208 48.7361 12.459 48.8934 12.8909 49.222C13.3229 49.5505 13.6181 50.0272 13.7199 50.5603V54.6503H12.4699V51.0503C12.4699 50.7585 12.354 50.4787 12.1477 50.2724C11.9414 50.0661 11.6617 49.9503 11.3699 49.9503H11.1399C10.8009 49.912 10.4601 50.0045 10.1869 50.2089C9.91378 50.4133 9.72888 50.7142 9.66992 51.0503V54.6603H8.40992V51.0003C8.371 50.6962 8.22261 50.4168 7.99252 50.2144C7.76243 50.0119 7.46642 49.9002 7.15992 49.9003C5.68992 49.9003 5.65992 51.0703 5.65992 51.0703L5.66992 54.6803Z" fill="white"/>
                                    <path d="M43.8199 48.7402C43.1826 48.8783 42.5886 49.1701 42.0899 49.5902V48.8902H40.8799V54.6902H42.1299V51.0502C42.1299 51.0502 42.1299 49.8802 43.6299 49.8802C43.8571 49.873 44.082 49.9283 44.2799 50.0402L44.6899 48.9402C44.4159 48.8169 44.1202 48.7489 43.8199 48.7402Z" fill="white"/>
                                    <path d="M61.52 48.7402C60.8827 48.8783 60.2888 49.1701 59.79 49.5902V48.8902H58.54V54.6902H59.79V51.0502C59.79 51.0502 59.79 49.8802 61.29 49.8802C61.5173 49.873 61.7421 49.9283 61.94 50.0402L62.35 48.9402C62.0809 48.8263 61.7923 48.7652 61.5 48.7602L61.52 48.7402Z" fill="white"/>
                                    <path d="M17.7001 48.7202C16.9166 48.7385 16.1714 49.0626 15.6239 49.6233C15.0763 50.1839 14.7699 50.9365 14.7701 51.7202V51.8202C14.7642 52.6132 15.0664 53.3775 15.613 53.9521C16.1595 54.5266 16.9078 54.8665 17.7001 54.9002C18.4026 54.8539 19.0719 54.584 19.6101 54.1302V54.7202H20.8201V48.8902H19.6601V49.6402C19.1363 49.0909 18.4186 48.7679 17.6601 48.7402L17.7001 48.7202ZM17.9401 49.9002C18.3251 49.8786 18.7079 49.9721 19.0395 50.169C19.3711 50.3659 19.6365 50.6572 19.8018 51.0056C19.9671 51.354 20.0248 51.7438 19.9676 52.1252C19.9103 52.5066 19.7407 52.8622 19.4803 53.1468C19.22 53.4313 18.8808 53.6318 18.506 53.7226C18.1312 53.8134 17.7378 53.7905 17.3761 53.6567C17.0144 53.5229 16.7008 53.2843 16.4753 52.9715C16.2498 52.6586 16.1226 52.2857 16.1101 51.9002V51.7902C16.1021 51.5433 16.1428 51.2972 16.23 51.0661C16.3171 50.8349 16.449 50.6232 16.618 50.443C16.7871 50.2628 16.9899 50.1177 17.2151 50.016C17.4402 49.9143 17.6832 49.858 17.9301 49.8502L17.9401 49.9002Z" fill="white"/>
                                    <path d="M53.7098 48.7202C52.9246 48.754 52.1841 49.0946 51.6474 49.6687C51.1107 50.2428 50.8207 51.0045 50.8398 51.7902C50.8339 52.5832 51.136 53.3475 51.6826 53.922C52.2292 54.4966 52.9775 54.8365 53.7698 54.8702C54.4723 54.8238 55.1415 54.554 55.6798 54.1002V54.6902H56.9098V48.8402H55.6698V49.5902C55.146 49.0408 54.4283 48.7179 53.6698 48.6902L53.7098 48.7202ZM53.9998 49.9002C54.3807 49.8779 54.7597 49.9685 55.0894 50.1606C55.4191 50.3526 55.6848 50.6376 55.8533 50.9799C56.0219 51.3222 56.0857 51.7067 56.0369 52.0851C55.9881 52.4635 55.8288 52.8191 55.5789 53.1075C55.329 53.3958 54.9996 53.604 54.632 53.7061C54.2644 53.8082 53.8748 53.7997 53.512 53.6815C53.1492 53.5633 52.8293 53.3408 52.5924 53.0417C52.3554 52.7427 52.2119 52.3804 52.1798 52.0002V51.8602C52.169 51.6116 52.2078 51.3634 52.2937 51.1299C52.3796 50.8965 52.5111 50.6823 52.6804 50.5C52.8496 50.3177 53.0534 50.1708 53.2799 50.0679C53.5064 49.9649 53.7511 49.9079 53.9998 49.9002Z" fill="white"/>
                                    <path d="M65.5701 48.7203C64.7849 48.7541 64.0444 49.0947 63.5077 49.6688C62.971 50.2429 62.681 51.0046 62.7001 51.7903C62.6942 52.5833 62.9964 53.3476 63.543 53.9221C64.0895 54.4967 64.8378 54.8366 65.6301 54.8703C66.3326 54.8239 67.0019 54.5541 67.5401 54.1003V54.6903H68.7701V46.5503H67.5701V49.5503C67.0463 49.0009 66.3286 48.678 65.5701 48.6503V48.7203ZM65.8101 49.9003C66.1951 49.8786 66.5779 49.9722 66.9095 50.1691C67.2411 50.366 67.5065 50.6573 67.6718 51.0057C67.8371 51.3541 67.8948 51.7439 67.8376 52.1253C67.7803 52.5067 67.6107 52.8623 67.3503 53.1468C67.09 53.4314 66.7508 53.6318 66.376 53.7227C66.0012 53.8135 65.6078 53.7905 65.2461 53.6568C64.8844 53.523 64.5708 53.2844 64.3453 52.9716C64.1198 52.6587 63.9926 52.2857 63.9801 51.9003V51.7903C63.9721 51.5434 64.0128 51.2973 64.1 51.0661C64.1871 50.835 64.319 50.6233 64.488 50.4431C64.6571 50.2629 64.8599 50.1178 65.0851 50.0161C65.3102 49.9144 65.5532 49.858 65.8001 49.8503L65.8101 49.9003Z" fill="white"/>
                                    <path d="M24.6797 54.8802C23.8065 54.835 22.9595 54.5664 22.2197 54.1002L22.7597 53.2802C23.363 53.557 24.0088 53.7294 24.6697 53.7902C25.1897 53.7902 26.0697 53.6302 26.0697 53.1102C26.0697 52.5902 24.6097 52.4102 24.6097 52.4102C24.6097 52.4102 22.4097 52.4102 22.4097 50.5802C22.4097 49.4802 23.5097 48.7302 24.9197 48.7302C25.7275 48.8434 26.5133 49.0795 27.2497 49.4302L26.6297 50.3802C26.0546 50.1487 25.4535 49.9876 24.8397 49.9002C24.3097 49.9002 23.7397 50.1302 23.7397 50.5802C23.7397 51.8102 27.3997 50.4802 27.3997 52.9702C27.3997 54.6002 25.8997 54.8902 24.7197 54.8902L24.6797 54.8802Z" fill="white"/>
                                    <path d="M29.3798 47.2102V48.9002H28.2798V50.1202H29.3798V53.0002C29.3636 53.2488 29.3969 53.4981 29.4779 53.7337C29.5588 53.9693 29.6858 54.1864 29.8514 54.3725C30.0171 54.5586 30.218 54.7099 30.4426 54.8177C30.6672 54.9254 30.911 54.9875 31.1598 55.0002H31.4198C32.0188 54.9304 32.6067 54.786 33.1698 54.5702L32.6798 53.3102C32.3955 53.5389 32.0445 53.6687 31.6798 53.6802C30.6798 53.6802 30.6798 53.0302 30.6798 53.0302V50.1202H32.6798V48.9002H30.7298V47.2102H29.3798Z" fill="white"/>
                                    <path d="M36.7702 48.7903C35.9467 48.8075 35.1637 49.1512 34.5936 49.7457C34.0235 50.3402 33.7129 51.1368 33.7302 51.9603C33.7474 52.7838 34.0911 53.5667 34.6856 54.1368C35.2801 54.7069 36.0767 55.0175 36.9002 55.0003C37.7102 54.8938 38.4879 54.6141 39.1802 54.1803L38.6102 53.1803C38.1065 53.5335 37.5217 53.7536 36.9102 53.8203C36.4815 53.8315 36.065 53.6765 35.7481 53.3875C35.4312 53.0986 35.2384 52.6982 35.2102 52.2703H39.4902C39.4902 52.2703 39.8302 48.7903 36.7702 48.7903ZM36.5802 49.8903H36.7702C37.1384 49.8655 37.5016 49.9871 37.7806 50.2287C38.0597 50.4703 38.232 50.8123 38.2602 51.1803V51.3303H35.2602C35.2653 50.9809 35.4057 50.647 35.6518 50.399C35.898 50.1509 36.2308 50.008 36.5802 50.0003H36.6402L36.5802 49.8903Z" fill="white"/>
                                    <path d="M49.54 53.1403L50.11 54.2403C49.5238 54.5968 48.8557 54.7965 48.17 54.8203C47.7602 54.8446 47.3495 54.7878 46.9616 54.6531C46.5738 54.5184 46.2163 54.3085 45.9097 54.0353C45.6031 53.7622 45.3535 53.4312 45.1751 53.0614C44.9967 52.6916 44.893 52.2902 44.87 51.8803V51.7603C44.851 50.9915 45.135 50.2461 45.6607 49.6848C46.1864 49.1236 46.9117 48.7915 47.68 48.7603H48C48.7574 48.789 49.4946 49.0129 50.14 49.4103L49.49 50.5103C49.2358 50.2168 48.8969 50.0092 48.5199 49.9161C48.1429 49.823 47.7463 49.8489 47.3846 49.9903C47.023 50.1317 46.714 50.3816 46.5 50.7057C46.2861 51.0298 46.1779 51.4121 46.19 51.8003C46.1571 52.2736 46.3134 52.7407 46.6247 53.0989C46.9359 53.457 47.3767 53.6769 47.85 53.7103H48C48.5632 53.6725 49.0994 53.4552 49.53 53.0903L49.54 53.1403Z" fill="white"/>
                                    <path d="M28.3199 64.36L19.3799 85.71H13.5499L9.1399 68.71C9.10204 68.3116 8.96266 67.9296 8.73506 67.6005C8.50746 67.2713 8.19926 67.0061 7.8399 66.83C6.10939 65.9993 4.28192 65.3879 2.3999 65.01L2.5299 64.39H11.8799C12.4991 64.3863 13.0987 64.6071 13.5676 65.0116C14.0365 65.4161 14.3428 65.9769 14.4299 66.59L16.7599 78.93L22.4999 64.42L28.3199 64.36ZM51.1499 78.71C51.1499 73.1 43.3799 72.77 43.4399 70.26C43.4399 69.5 44.1899 68.68 45.7799 68.5C47.6469 68.3385 49.5229 68.684 51.2099 69.5L52.2099 64.99C50.5469 64.3492 48.782 64.0138 46.9999 64C41.5399 64 37.7099 66.9 37.6799 71.05C37.6799 74.13 40.4099 75.83 42.4999 76.84C44.5899 77.85 45.3599 78.56 45.3599 79.48C45.3599 80.91 43.6399 81.54 42.0499 81.56C40.0899 81.5988 38.1523 81.1376 36.4199 80.22L35.4199 84.89C37.3761 85.638 39.4557 86.0112 41.5499 85.99C47.3399 85.99 51.1299 83.13 51.1499 78.7M65.5299 85.7H70.5299L66.1999 64.36H61.4899C60.9887 64.3567 60.4979 64.5035 60.0809 64.7815C59.6639 65.0595 59.3396 65.4561 59.1499 65.92L50.8699 85.68H56.6499L57.7499 82.5H64.7999L65.5299 85.7ZM59.3899 78.12L62.2899 70.12L63.9999 78.12H59.3899ZM36.1899 64.36L31.6399 85.71H26.1199L30.6799 64.36H36.1899Z" fill="url(#paint0_linear_2489_44)"/>
                                    <path d="M43.5402 96.8602L39.0002 106.56H38.5102V94.7602H32.2202V114.76H37.6102C38.3077 114.758 38.9899 114.555 39.5752 114.176C40.1604 113.796 40.6239 113.256 40.9102 112.62L45.3802 102.93H45.8402V114.72H52.2002V94.7202H46.8002C46.1027 94.7222 45.4205 94.925 44.8353 95.3045C44.25 95.6841 43.7865 96.2242 43.5002 96.8602" fill="#24A84D"/>
                                    <path d="M19.6601 97.3602L17.0001 106.56H16.5401L13.8901 97.3602C13.6711 96.6042 13.2122 95.9398 12.5827 95.4672C11.9533 94.9947 11.1872 94.7395 10.4001 94.7402H4.08008V114.74H10.4401V102.93H10.9001L14.5301 114.73H19.0701L22.7001 102.93H23.1601V114.73H29.5001V94.7302H23.1501C22.3655 94.7282 21.6014 94.9805 20.9722 95.4492C20.3431 95.918 19.8827 96.5779 19.6601 97.3302" fill="#24A84D"/>
                                    <path d="M54.9502 103.83V114.72H61.2902V108.37H68.1102C69.5187 108.372 70.8929 107.936 72.0429 107.122C73.193 106.309 74.0621 105.159 74.5302 103.83H54.9502Z" fill="#24A84D"/>
                                    <path d="M68.08 94.7603H54C54.4266 97.052 55.6404 99.1226 57.4316 100.614C59.2228 102.106 61.4789 102.925 63.81 102.93H74.74C74.8415 102.484 74.8985 102.028 74.91 101.57C74.9074 99.7676 74.1901 98.0395 72.9154 96.7648C71.6407 95.4902 69.9127 94.7729 68.11 94.7703" fill="url(#paint1_linear_2489_44)"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M114.004 0C130.571 0 144.001 13.4295 144.001 29.9962C144.001 46.5629 130.571 59.9924 114.004 59.9924C97.4383 59.9924 84.0083 46.5629 84.0083 29.9962C84.0083 13.4295 97.4383 0 114.004 0Z" fill="#F01010"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M112.727 20.2716H110.186C109.77 20.2243 109.262 20.2243 108.754 20.1789C108.616 20.2243 108.568 20.3647 108.522 20.5491C108.476 20.7344 108.522 20.8729 108.616 21.0109L109.17 21.0577C109.861 21.1948 110.37 21.3337 110.695 21.4737C111.017 21.6576 111.247 21.9814 111.341 22.3974C111.433 22.8133 111.479 23.3668 111.433 24.0608C111.386 25.0308 111.341 26.1851 111.295 27.5252C111.247 28.8668 111.156 30.2523 111.063 31.6855C110.971 33.901 110.772 39.2991 110.17 40.8972C110.031 41.2668 109.801 41.4985 109.523 41.6389C109.199 41.7755 108.828 41.9145 108.366 41.9623L107.625 42.0544C107.487 42.1456 107.44 42.2861 107.487 42.5172C107.487 42.6562 107.532 42.7937 107.671 42.9332C108.272 42.8874 108.828 42.8405 109.429 42.7937H113.086C113.779 42.8405 114.381 42.8874 114.936 42.9332C115.076 42.8405 115.168 42.7021 115.168 42.5172C115.168 42.3309 115.122 42.1929 114.982 42.0544L113.687 41.9623C113.27 41.9145 112.946 41.8228 112.715 41.6389C112.599 41.5448 112.506 41.4161 112.437 41.259C112.164 40.6021 112.158 39.4907 112.172 38.8007C112.202 37.3684 112.219 35.9366 112.265 34.5038C112.311 33.0715 112.357 31.8226 112.403 30.7604C112.448 29.7905 112.543 28.7727 112.588 27.7564C112.634 26.741 112.679 25.7233 112.727 24.707H112.819C113.189 25.4921 113.559 26.2778 113.882 27.1556C114.252 27.988 114.622 28.82 114.99 29.6061L118.087 36.2116C118.366 36.7681 118.688 37.461 119.057 38.2925C119.473 39.1703 119.888 40.0013 120.259 40.8328C120.454 41.2732 120.623 41.6857 120.767 42.0739C120.804 42.0739 121.063 42.9254 121.092 43.0244C121.27 43.2048 121.561 43.2005 121.74 43.0244C122.027 42.3358 122.327 41.6389 122.661 40.9728C123.536 39.0084 124.449 37.1324 125.48 35.2431L128.484 29.2823C128.715 28.7727 128.946 28.2182 129.269 27.6184C129.593 26.9717 129.916 26.3709 130.193 25.8627C130.424 25.3078 130.609 24.9386 130.7 24.7996H130.747L130.841 39.0791C130.886 39.8175 130.841 40.3695 130.794 40.786C130.757 41.1166 130.664 41.4307 130.347 41.5921C130.16 41.8228 129.791 41.9145 129.189 41.9623L128.171 42.0544C128.078 42.1456 128.033 42.2861 128.078 42.5172C128.078 42.6562 128.125 42.7937 128.265 42.9332C128.958 42.8874 129.697 42.8405 130.391 42.7937H134.372C135.065 42.8405 135.759 42.8874 136.455 42.9332C136.594 42.8405 136.64 42.7021 136.64 42.5172C136.685 42.3309 136.64 42.1929 136.547 42.0544L135.436 41.9623C134.927 41.9145 134.557 41.7755 134.325 41.5443C134.096 41.3136 133.91 41.0357 133.864 40.6655C133.816 40.25 133.77 39.7394 133.77 39.185C133.675 37.4659 133.611 35.7191 133.566 33.9961C133.519 32.1454 133.427 30.3913 133.381 28.7293V24.3378C133.381 23.5522 133.427 22.9518 133.519 22.489C133.614 22.074 133.844 21.7049 134.167 21.4737C134.491 21.2889 135.044 21.1489 135.784 21.0577L136.478 21.0109C136.571 20.9182 136.616 20.7797 136.571 20.5491C136.571 20.4096 136.524 20.2716 136.432 20.1789C135.877 20.2243 135.322 20.2243 134.814 20.2716H132.319C131.902 20.2243 131.439 20.2243 130.841 20.1789C130.794 20.9631 130.517 21.8429 130.101 22.8597C129.593 23.9204 128.993 25.2166 128.254 26.741L125.018 33.2554C124.179 35.029 123.415 36.7169 122.387 38.3983H122.295C121.477 36.8554 120.723 35.2543 119.981 33.6723L116.054 25.8159C115.547 24.707 115.084 23.6453 114.714 22.6748C114.39 21.7049 114.252 20.8729 114.298 20.1789C113.744 20.2243 113.235 20.2243 112.727 20.2716ZM93.7669 37.8365C93.7669 39.0133 93.7205 39.9092 93.6264 40.5226C93.5333 41.7106 92.7491 42.0998 91.6435 42.1759L90.9354 42.27C90.7077 42.4987 90.7253 42.9942 90.9847 43.1653C92.4448 43.0746 93.7649 43.0234 95.2299 43.0234C96.7919 43.0234 98.2481 43.0922 99.8052 43.1653C99.8993 43.0712 99.9481 42.9298 99.9949 42.7416C99.9949 42.506 99.9481 42.3631 99.853 42.27L98.9094 42.1759C98.1544 42.1271 97.636 41.9857 97.3532 41.7496C97.3361 41.7374 97.3191 41.7248 97.3025 41.7116C97.0172 41.4746 96.8129 41.1127 96.727 40.5519C96.6334 39.9394 96.5861 39.045 96.6334 37.8697V34.5696C95.5966 34.6174 94.6549 34.5696 93.8064 34.4287L93.7669 37.8365ZM90.7438 20.6276C90.6975 20.8153 90.7921 20.9563 90.9335 21.0987L92.1585 21.2382C92.6759 21.2869 93.0534 21.4274 93.2885 21.6634C93.5235 21.8512 93.6659 22.1818 93.7122 22.6992C93.76 23.2171 93.8064 23.9725 93.8064 24.9601V31.9318C94.7485 31.9791 95.6902 31.9791 96.6334 31.9318V22.3223C96.5861 21.9458 96.6334 21.6634 96.727 21.4274C96.7738 21.2869 96.9626 21.1435 97.1976 21.0987C97.4805 21.0514 97.9525 21.0514 98.5646 21.0514C100.354 21.0987 101.72 21.5688 102.709 22.5583C103.651 23.5463 104.122 24.9133 104.122 26.6103C104.171 28.1168 103.793 29.3886 102.993 30.4239C102.286 31.3208 101.25 31.9791 99.8359 32.3088C98.4705 32.6389 96.5393 32.7804 93.9478 32.7321C91.6865 32.6877 89.2374 32.5453 86.5522 32.263C89.5207 32.875 91.7338 33.2983 93.148 33.4392C95.4547 33.7235 97.716 33.6748 99.8359 33.3466C100.919 33.2037 101.909 32.9223 102.804 32.5926C103.651 32.2161 104.5 31.6977 105.395 31.0842C105.913 30.7083 106.384 30.0938 106.809 29.2945C107.139 28.5406 107.327 27.6457 107.373 26.5616C107.327 25.3834 107.044 24.3495 106.526 23.4532C106.007 22.5583 105.395 21.8512 104.594 21.3347C103.793 20.8626 102.804 20.4847 101.673 20.2492C100.59 20.0614 99.3175 19.9668 97.8579 19.9668C96.4442 19.9668 95.1723 19.9668 94.0424 20.0136C92.9115 20.0614 91.8752 20.1082 90.9793 20.2023C90.8389 20.2974 90.7438 20.4384 90.7438 20.6276Z" fill="white"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M98.2895 71.2161L89.038 90.5882C89.0028 90.6603 88.9917 90.7417 89.0062 90.8205C89.0207 90.8993 89.0602 90.9715 89.1188 91.0263L114.105 114.894C114.176 114.962 114.27 115 114.369 115C114.467 115 114.561 114.962 114.632 114.894L139.618 91.0278C139.677 90.9729 139.716 90.9008 139.731 90.822C139.745 90.7432 139.734 90.6618 139.699 90.5897L130.448 71.2176C130.418 71.1525 130.37 71.0974 130.309 71.0588C130.249 71.0203 130.179 70.9998 130.107 71H98.6333C98.5612 70.9991 98.4904 71.0191 98.4294 71.0574C98.3684 71.0957 98.3198 71.1509 98.2895 71.2161Z" fill="#50AF95"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M117.579 92.5775C117.399 92.5909 116.473 92.6461 114.405 92.6461C112.761 92.6461 111.593 92.5969 111.184 92.5775C104.829 92.2988 100.086 91.1961 100.086 89.8758C100.086 88.5556 104.829 87.4543 111.184 87.1712V91.4793C111.599 91.5091 112.789 91.5791 114.434 91.5791C116.407 91.5791 117.395 91.4971 117.573 91.4807V87.1742C123.914 87.4558 128.646 88.5585 128.646 89.8758C128.646 91.1931 123.915 92.2959 117.573 92.576L117.579 92.5775ZM117.579 86.7286V82.8736H126.428V76.9949H102.335V82.8736H111.182V86.7271C103.991 87.0565 98.5825 88.4766 98.5825 90.1783C98.5825 91.8801 103.991 93.2987 111.182 93.6296V105.983H117.577V93.6251C124.752 93.2958 130.152 91.8771 130.152 90.1769C130.152 88.4766 124.757 87.0579 117.577 86.7271L117.579 86.7286Z" fill="white"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_2489_44" x1="2.3999" y1="75" x2="70.5999" y2="75" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#241E5C"/>
                                            <stop offset="1" stopColor="#004D9F"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_2489_44" x1="54.01" y1="98.8403" x2="74.89" y2="98.8403" gradientUnits="userSpaceOnUse">
                                            <stop offset="0.01" stopColor="#0FA5E1"/>
                                            <stop offset="0.35" stopColor="#0C9CDA"/>
                                            <stop offset="0.91" stopColor="#0483C6"/>
                                            <stop offset="1" stopColor="#037EC2"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </button>
                        </ul>
                    </div>
                    {registerRequest.payMethod === 'paypal' && <p className="text">{PayPalData.getText(tournament.participationPrice, false)}</p>}
                    { !isLoading && <button
                        className="button-both-accent popup__accentButton"
                        onClick={async () => {
                            setIsLoading(true)
                            const response = await TournamentRegisterSubmit(newTeamUsed, tournamentRegistrationUsed, clearError, token, request, setMessageOptions, refetchHandler)
                            setIsLoading(false)
                            if (response.isOk) {
                                if (tournament && tournament.participationPrice && response.url) {
                                    window.location.replace(response.url)
                                }
                                setCurrentStep(currentStep + 1)
                            } else {
                                setCurrentStep(currentStep - 1)
                            }
                        }}
                    >
                        <span>{__('Принять участие')}</span>
                    </button>}
                    { isLoading && <Loader/>}
                </>
            }
        </Popup>
    );
};

export default TeamRegisterPopup;