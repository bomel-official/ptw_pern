import React, {ChangeEvent, Dispatch, useCallback, useContext, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import {icons} from "../../data/PlatformIcons";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {Popup} from "./Popup";
import {IMessageOptions, ITeam, IUser} from "../../StoreTypes";
import {getFile} from "../../functions/getFile";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/http.hook";
import {initNewTeam} from "../../hooks/newTeam.hook";
import {isUserAdmin} from "../../functions/isUserAdmin";

const TeamRegisterPopup = ({newTeamUsed, tournamentRegistrationUsed, playersInTeam, isRegisterFormActive, setIsRegisterFormActive, submitHandler, messageOptions}: {
    newTeamUsed: any,
    tournamentRegistrationUsed: any,
    playersInTeam: number,
    isRegisterFormActive: boolean,
    setIsRegisterFormActive: Dispatch<boolean>,
    submitHandler: () => Promise<boolean>,
    messageOptions: IMessageOptions
}) => {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const [teams, setTeams] = useState<Array<ITeam>>([])
    const {user} = useContext(AuthContext)
    const {request} = useHttp()

    const fetchTeams = useCallback(async () => {
        if (user && isUserAdmin(user)) {
            const {rows} = await request(`/api/team/search?type=all`, 'GET')
            setTeams(rows)
        } else if (user && user.id) {
            const {rows} = await request(`/api/team/search?userId=${user.id}&type=own`, 'GET')
            setTeams(rows)
        }
    }, [user])

    useEffect(() => {
        fetchTeams().catch()
    }, [fetchTeams, user])

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
        registerRequest
    } = tournamentRegistrationUsed

    useEffect(() => {
        if (user && !isUserAdmin(user) && !newTeam.id && !newTeam.capitanId) {
            setNewTeam({...newTeam, capitanId: user.id, players: [user]})
        }
    }, [newTeam, user])

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
            </div>
            <div className="popup__progressbar mb12">
                <div className="popup__progressbar-value" style={{width: `${(currentStep / 4 * 100).toFixed(2)}%`}}></div>
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
                        <span className="fileInput__text">{newTeam.avatar ? newTeam.avatar.name : __('Загрузить аватар')}</span>
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
                            <span className="white-hoverText">/{playersInTeam}</span>
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
                                            changeRequestPlayers(player, playersInTeam)
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
                        <button
                            className="button-both-accent popup__accentButton"
                            onClick={async () => {
                                const response = await submitHandler()
                                if (response) {
                                    setCurrentStep(currentStep + 1)
                                }
                            }}
                        >
                            <span>{__('Принять участие')}</span>
                        </button>
                    </>}
                </>
            }
        </Popup>
    );
};

export default TeamRegisterPopup;