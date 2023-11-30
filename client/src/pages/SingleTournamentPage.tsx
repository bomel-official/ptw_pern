import {NavLink, useParams} from "react-router-dom";
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {Footer} from "../components/base/Footer";

import SingleTournamentImage from "../static/images/TournamentTopImage.jpg"
import {__, _f} from "../multilang/Multilang";
import {TournamentTabs} from "../data/SingleTournamentTabs";
import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {getSlotWord} from "../data/Translations";
import {useNewTeam} from "../hooks/newTeam.hook";
import {useTournamentRegistration} from "../hooks/tournamentRegistration.hook";
import TeamRegisterPopup from "../components/base/TeamRegisterPopup";
import TournamentRating from "../components/tournament/TournamentRating";
import {AuthContext} from "../context/AuthContext";
import {IMessageOptions, ITournament} from "../StoreTypes";
import {useHttp} from "../hooks/http.hook";
import {Games} from "../data/Games";
import {getDateString} from "../functions/getDateString";

export const SingleTournamentPage = () => {
    const {user, token} = useContext(AuthContext)
    const [playersInTeam, setPlayersInTeam] = useState<number>(3)
    const {slug, currentTab} = useParams()
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const [isRegisterFormActive, setIsRegisterFormActive] = useState<boolean>(false)
    const [tournament, setTournament] = useState<ITournament|null>(null)
    const [isRegisterActive, setIsRegisterActive] = useState(false)
    const {request, error, clearError} = useHttp()
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const fetchTournament = useCallback(async () => {
        const {tournament} = await request(`/api/tournament/${slug}`, 'GET')
        setTournament(tournament)
    }, [])

    useEffect(() => {
        const dateBegin = new Date(tournament?.dateBegin || 0)
        let registerFlag = false
        if (
            (tournament) &&
            (user) &&
            (dateBegin.getTime() > Date.now()) &&
            (tournament.isRegisterOn) &&
            (!tournament.participantsList.includes(user.id)) &&
            (tournament.participantsList.length + playersInTeam <= tournament.maxUsers)
        ) {
            registerFlag = true
        }
        setIsRegisterActive(registerFlag)
    }, [tournament, user])

    useEffect(() => {
        fetchTournament().catch(() => {})
    }, [slug])


    const newTeamUsed = useNewTeam()
    const tournamentRegistrationUsed = useTournamentRegistration()

    useEffect(() => {
        if (user) {
            newTeamUsed.setNewTeam({...newTeamUsed.newTeam, players: [user], capitanId: user.id})
            tournamentRegistrationUsed.setRegisterRequest({...tournamentRegistrationUsed.registerRequest, players: [user], capitan: user.id})
        }
    }, [user])

    useEffect(() => {
        if (tournament && tournament.id) {
            tournamentRegistrationUsed.changeRegisterForm('tournamentId', tournament.id)
        }
    }, [tournament])


    const formData = new FormData()

    const submitHandler = async () => {
        clearError()
        try {
            let teamId = newTeamUsed.newTeam.id
            if (teamId === null) {
                const teamKeys = Object.keys(newTeamUsed.newTeam) as Array<keyof typeof newTeamUsed.newTeam>
                teamKeys.forEach((key) => {
                    if (newTeamUsed.newTeam.hasOwnProperty(key) && key !== 'avatar_path') {
                        if (key === 'avatar') {
                            formData.set(key, newTeamUsed.newTeam.avatar || '')
                        } else if (key === 'players') {
                            formData.set(key, JSON.stringify(newTeamUsed.newTeam.players.map((pl => (pl.id)))))
                        } else {
                            formData.set(key, (newTeamUsed.newTeam[key]) ? JSON.stringify(newTeamUsed.newTeam[key]) : '')
                        }
                    }
                })
                const {team} = await request(`/api/team/save-create`, 'POST', formData, {
                    Authorization: `Bearer ${token}`
                }, false)
                if (!team) {
                    return false
                }
                teamId = team.id
                newTeamUsed.changeNewTeam('id', team.id)
            }
            console.log(teamId, newTeamUsed.newTeam)
            const {isOk} = await request(`/api/tournament/register`, 'POST', {
                teamId: teamId,
                tournamentId: tournamentRegistrationUsed.registerRequest.tournamentId,
                players: tournamentRegistrationUsed.registerRequest.players.map(pl => pl.id)
            }, {
                Authorization: `Bearer ${token}`
            }, true)
            if (isOk) {
                setMessageOptions({
                    status: 'pos', text: 'Вы зарегистрировалиь!!'
                })
                return true
            }
        } catch (e) {}
        return false
    }

    const dateBegin = new Date(tournament?.dateBegin || 0)
    const dateEnd = new Date(tournament?.dateEnd || 0)

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            { tournament && <><div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-top gradientBG">
                        <img src={SingleTournamentImage} alt="Tournament" className="side__content-top-bg"/>
                        <div className="side__container">
                            <div className="side__top-flex">
                                <div className="side__top-left">
                                    <div className="side__title">{_f(tournament, 'title')}</div>
                                    <div className="side__top-info">
                                        <div className="side__top-info-item flex">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{tournament.participantsList.length} / {tournament.maxUsers} {__('участников')}</span>
                                        </div>
                                        <div className="side__top-info-item flex">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{getDateString(dateBegin, 'dd.mm.yyyy h:i')} – {getDateString(dateEnd, 'dd.mm.yyyy h:i')}</span>
                                        </div>
                                        <div className="side__top-info-item flex">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_95_5058)">
                                                    <path d="M6.6665 11.6667C9.42793 11.6667 11.6665 9.42811 11.6665 6.66669C11.6665 3.90526 9.42793 1.66669 6.6665 1.66669C3.90508 1.66669 1.6665 3.90526 1.6665 6.66669C1.6665 9.42811 3.90508 11.6667 6.6665 11.6667Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M15.075 8.64166C15.8628 8.93535 16.5638 9.42294 17.1132 10.0593C17.6625 10.6957 18.0426 11.4604 18.2182 12.2826C18.3937 13.1047 18.3591 13.9579 18.1176 14.7632C17.876 15.5685 17.4353 16.2998 16.8362 16.8897C16.2371 17.4795 15.499 17.9087 14.69 18.1377C13.8811 18.3666 13.0275 18.3879 12.2081 18.1995C11.3888 18.0112 10.6301 17.6192 10.0024 17.06C9.37465 16.5007 8.89806 15.7922 8.6167 15" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M5.8335 5H6.66683V8.33333" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M13.9249 11.5667L14.5082 12.1583L12.1582 14.5083" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_95_5058">
                                                        <rect width="20" height="20" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>{tournament.participationPrice ? tournament.participationPrice + ' ' + __('за участие') : __('Свободное участие')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="side__top-right">
                                    <div className="side__top-reg-time">{__('Регистрация до')} {getDateString(dateBegin, 'dd.mm.yyyy h:i')}</div>
                                    <div className="side__top-buttons flex">
                                        {isRegisterActive && <button
                                            className="side__top-register"
                                            onClick={() => setIsRegisterFormActive(true)}
                                        >
                                            {__('Принять участие')}
                                        </button>}
                                        {!isRegisterActive && <span className="side__top-reg-inactive">{__('Региистрация недоступна')}</span>}
                                        <NavLink to={tournament.twitchChannel} target="_blank" className="side__top-share">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.15833 11.2584L12.85 14.575M12.8417 5.42502L7.15833 8.74169M17.5 4.16669C17.5 5.5474 16.3807 6.66669 15 6.66669C13.6193 6.66669 12.5 5.5474 12.5 4.16669C12.5 2.78598 13.6193 1.66669 15 1.66669C16.3807 1.66669 17.5 2.78598 17.5 4.16669ZM7.5 10C7.5 11.3807 6.38071 12.5 5 12.5C3.61929 12.5 2.5 11.3807 2.5 10C2.5 8.61931 3.61929 7.50002 5 7.50002C6.38071 7.50002 7.5 8.61931 7.5 10ZM17.5 15.8334C17.5 17.2141 16.3807 18.3334 15 18.3334C13.6193 18.3334 12.5 17.2141 12.5 15.8334C12.5 14.4526 13.6193 13.3334 15 13.3334C16.3807 13.3334 17.5 14.4526 17.5 15.8334Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="side__tab-headings ds">
                                { Object.values(TournamentTabs).map((tab, index) => (
                                    <NavLink
                                        to={`/tournament/${slug}/${tab.slug}`}
                                        key={index}
                                        className={currentTab === tab.slug ? "side__tab-heading active": "side__tab-heading"}
                                    >
                                        {__(`${tab.text}`)}
                                    </NavLink>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <div className="dropdown mb mb24">
                                <button
                                    className="dropdown__current"
                                    onClick={() => setIsDropdownActive(!isDropdownActive)}
                                >
                                    <span>{(currentTab && (currentTab in TournamentTabs)) ? __(TournamentTabs[currentTab].text) : __(TournamentTabs['about'].text)}</span>
                                    <span className="ml-auto">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                                    {Object.values(TournamentTabs).map((tab, index) => (
                                        (currentTab !== tab.slug) && <li className="dropdown__value" key={index}>
                                            <NavLink
                                                to={`/tournament/${slug}/${tab.slug}`}
                                                onClick={() => setIsDropdownActive(false)}
                                            >
                                                {__(tab.text)}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            { (currentTab === 'about') && <div className="tournament pb104">
                                <div className="tournament__content">
                                    <div className="tournament__fund">
                                        <div className="tournament__fund-top">
                                            <h2 className="tournament__fund-heading">{__('Призовой фонд')}</h2>
                                            <div className="tournament__fund-number">{tournament.prizes} ₽</div>
                                        </div>
                                        <div className="tournament__fund-bottom grid c3">
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">1 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">{tournament.prize_1} ₽</div>
                                            </div>
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">2 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">{tournament.prize_2} ₽</div>
                                            </div>
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">3 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">{tournament.prize_3} ₽</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Основная информация')}</h2>
                                        <div className="tournament__block-grid main-info-grid grid c3">
                                            <div className="tournament__block-grid-item">
                                                <h3 className="tournament__block-grid-item-heading">{__('Игра')}</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M4.99984 9.16669H8.33317M6.6665 7.50002V10.8334M12.4998 10H12.5082M14.9998 8.33335H15.0082M14.4332 4.16669H5.5665C4.74174 4.16688 3.94633 4.47283 3.33403 5.02541C2.72174 5.57798 2.33604 6.33793 2.2515 7.15835C2.2465 7.20169 2.24317 7.24252 2.23734 7.28502C2.16984 7.84669 1.6665 12.0467 1.6665 13.3334C1.6665 13.9964 1.9299 14.6323 2.39874 15.1011C2.86758 15.57 3.50346 15.8334 4.1665 15.8334C4.99984 15.8334 5.4165 15.4167 5.83317 15L7.0115 13.8217C7.32399 13.5091 7.74785 13.3334 8.18984 13.3334H11.8098C12.2518 13.3334 12.6757 13.5091 12.9882 13.8217L14.1665 15C14.5832 15.4167 14.9998 15.8334 15.8332 15.8334C16.4962 15.8334 17.1321 15.57 17.6009 15.1011C18.0698 14.6323 18.3332 13.9964 18.3332 13.3334C18.3332 12.0459 17.8298 7.84669 17.7623 7.28502C17.7565 7.24335 17.7532 7.20169 17.7482 7.15919C17.6638 6.33861 17.2782 5.57846 16.6659 5.02572C16.0536 4.47297 15.2581 4.1669 14.4332 4.16669Z"
                                                            stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                                            strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{Games[tournament?.game || 'warzone'].name}</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item">
                                                <h3 className="tournament__block-grid-item-heading">{__('Размер команды')}</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{tournament.playersInTeam} {__('игроков')}</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item">
                                                <h3 className="tournament__block-grid-item-heading">{__('Формат')}</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M10.8333 1.66669L2.5 11.6667H10L9.16667 18.3334L17.5 8.33335H10L10.8333 1.66669Z"
                                                            stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                                            strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{_f(tournament, 'format')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Дополнительные сведения')}</h2>
                                        <p className="tournament__block-text">{_f(tournament, 'descAdditional')}</p>
                                    </div>
                                    {false && <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Расписание игр')}</h2>
                                        <div className="tournament__block-grid grid c1">
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Этап')} №1</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>12:00 25.05.2023</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Этап')} №2</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>12:00 25.05.2023</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Этап')} №3</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>12:00 25.05.2023</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Этап')} №4</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 1.66663V4.99996M6.66667 1.66663V4.99996M2.5 8.33329H17.5M4.16667 3.33329H15.8333C16.7538 3.33329 17.5 4.07948 17.5 4.99996V16.6666C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6666V4.99996C2.5 4.07948 3.24619 3.33329 4.16667 3.33329Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>12:00 25.05.2023</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <div className="tournament__sidebar ds">
                                    <div className="tournament__block mb24">
                                        <h2 className="tournament__block-subheading">{__('Расписание игр')}</h2>
                                        <div className="tournament__block-grid grid c1">
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Участники турнира')}</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{Math.floor(tournament.participantsList.length / tournament.playersInTeam)} {__('команд')}</span>
                                                </div>
                                            </div>
                                            <div className="tournament__block-grid-item c1">
                                                <h3 className="tournament__block-grid-item-heading">{__('Свободные слоты')}</h3>
                                                <div className="tournament__block-grid-item-row">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M14.1667 15C14.1667 14.558 13.9911 14.1341 13.6785 13.8215C13.366 13.5089 12.942 13.3334 12.5 13.3334H7.5C7.05797 13.3334 6.63405 13.5089 6.32149 13.8215C6.00893 14.1341 5.83333 14.558 5.83333 15M6.66667 1.66669V3.33335M13.3333 1.66669V3.33335M4.16667 3.33335H15.8333C16.7538 3.33335 17.5 4.07955 17.5 5.00002V16.6667C17.5 17.5872 16.7538 18.3334 15.8333 18.3334H4.16667C3.24619 18.3334 2.5 17.5872 2.5 16.6667V5.00002C2.5 4.07955 3.24619 3.33335 4.16667 3.33335ZM11.6667 8.33335C11.6667 9.25383 10.9205 10 10 10C9.07953 10 8.33333 9.25383 8.33333 8.33335C8.33333 7.41288 9.07953 6.66669 10 6.66669C10.9205 6.66669 11.6667 7.41288 11.6667 8.33335Z"
                                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{Math.floor(tournament.maxUsers / tournament.playersInTeam) - Math.floor(tournament.participantsList.length / tournament.playersInTeam)} {__(getSlotWord(Math.floor(tournament.maxUsers / tournament.playersInTeam) - Math.floor(tournament.participantsList.length / tournament.playersInTeam)))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <NavLink to={`/tournament/${slug}/participants`}
                                             className="tournament__participants-link">{__('Смотреть участников')}</NavLink>
                                </div>
                            </div>}
                            { (currentTab === 'participants') && <div className="rating pb104">
                                <div className="tournament__content">
                                    <div className="tournament__fund">
                                        <div className="tournament__fund-top both-borders">
                                            <h2 className="tournament__fund-heading">{__('Свободные слоты')}</h2>
                                            <div className="tournament__fund-number">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>{Math.floor(tournament.maxUsers / tournament.playersInTeam) - Math.floor(tournament.participantsList.length / tournament.playersInTeam)} {__(getSlotWord(Math.floor(tournament.maxUsers / tournament.playersInTeam) - Math.floor(tournament.participantsList.length / tournament.playersInTeam)))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Участники турнира')}</h2>
                                    </div>
                                    <TournamentRating tournament={tournament}/>
                                </div>
                            </div> }
                            { (currentTab === 'rating') && <div className="rating pb104">
                                <div className="tournament__content">
                                    {dateEnd.getTime() < new Date().getTime() && <div className="tournament__fund">
                                        <div className="tournament__fund-top">
                                            <h2 className="tournament__fund-heading">{__('Победители')}</h2>
                                            <div className="tournament__fund-number">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z"
                                                        stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                        strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>Мы – растения</span>
                                            </div>
                                        </div>
                                        <div className="tournament__fund-bottom grid c3">
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">1 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">20 000 ₽</div>
                                            </div>
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">2 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">10 000 ₽</div>
                                            </div>
                                            <div className="tournament__fund-item">
                                                <h3 className="tournament__fund-item-place">3 {__('место')}</h3>
                                                <div className="tournament__fund-item-prize">5 000 ₽</div>
                                            </div>
                                        </div>
                                    </div>}
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Результаты турнира')}</h2>
                                    </div>
                                    <TournamentRating tournament={tournament}/>
                                </div>
                            </div> }
                            { (currentTab === 'rules') && <div className="tournament pb104">
                                <div className="tournament__content">
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Правила турнира')}</h2>
                                        <p className="tournament__block-text">{_f(tournament, 'descRules')}</p>
                                    </div>
                                </div>
                            </div> }
                        </div>
                    </div>
                </div>
            </div>
            <TeamRegisterPopup
                newTeamUsed={newTeamUsed}
                tournamentRegistrationUsed={tournamentRegistrationUsed}
                playersInTeam={tournament.playersInTeam}
                isRegisterFormActive={isRegisterFormActive}
                setIsRegisterFormActive={setIsRegisterFormActive}
                submitHandler={submitHandler}
                messageOptions={messageOptions}
            /></>}

            <Footer/>
        </div>
    )
}