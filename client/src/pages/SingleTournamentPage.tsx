import {NavLink, useParams} from "react-router-dom";
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {Footer} from "../components/base/Footer";

import SingleTournamentImage from "../static/images/TournamentTopImage.jpg"
import {__, _f} from "../multilang/Multilang";
import {TournamentTabs} from "../data/SingleTournamentTabs";
import React, {useContext, useEffect, useState} from "react";
import {getSlotWord} from "../data/Translations";
import TeamRegisterPopup from "../components/base/TeamRegisterPopup";
import TournamentRating from "../components/tournament/TournamentRating";
import {AuthContext} from "../context/AuthContext";

import {useGetTournamentBySlugQuery} from '../store/playtowin/playtowin.api'
import SingleTournamentTop from "../components/tournament/SingleTournamentTop";
import SingleTournamentAbout from "../components/tournament/SingleTournamentAbout";
import {getTournamentAdditionalFields} from "../functions/getTournamentAdditionalFields";
import {getRegisterHTML} from "../functions/getRegisterHTML";
import {IParticipant} from "../StoreTypes";
import {useHttp} from "../hooks/http.hook";
import NavDropdown from "../components/base/NavDropdown";
import {parseUrls} from "../functions/parseUrls";

export const SingleTournamentPage = () => {
    const {user} = useContext(AuthContext)
    const {slug, currentTab} = useParams()
    const [refetch, setRefetch] = useState<boolean>(false)
    const {data: tournament} = useGetTournamentBySlugQuery(slug ?? '', {
        skip: !slug,
        refetchOnFocus: true
    })
    const [isRegisterFormActive, setIsRegisterFormActive] = useState<boolean>(false)

    const {slots} = getTournamentAdditionalFields(tournament, user)
    const registerHTML = getRegisterHTML(tournament, user, () => setIsRegisterFormActive(true))
    const [participant, setParticipant] = useState<IParticipant | null>(null)

    const {request} = useHttp()

    const fetchCurrentParticipant = async () => {
        const {participant: newParticipant} = await request(`/api/tournament/get-own-participant?tournamentId=${tournament?.id}&userId=${user?.id}`, 'GET')
        if (newParticipant) {
            setParticipant(newParticipant)
        }
    }

    useEffect(() => {
        if (tournament && user) {
            fetchCurrentParticipant().catch(e => {})
        }
    }, [tournament, user])

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
                            <SingleTournamentTop tournament={tournament} registerHTML={registerHTML}/>
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
                            <NavDropdown currentTab={currentTab} tabs={TournamentTabs} defaultTab={'about'} url={`/tournament/${slug}`}/>
                            {!!tournament.participationPrice && !!participant && !participant.isPaid && <div className="pb32">
                                <div className="tournament__content">
                                    <p className="text">{__('Вам необходимо оплатить участие на турнир.')}</p>
                                    <div className="flex">
                                        {!!participant.invoiceUrl && <>
                                            <NavLink
                                                className="button-both-accent corner-margin"
                                                to={`${participant.invoiceUrl}`}
                                                target="_blank"
                                                style={{
                                                    marginRight: "16px"
                                                }}
                                            >
                                                <span>{__('Оплатить')}</span>
                                            </NavLink>
                                        </>}
                                    </div>
                                </div>
                            </div>}
                            { (currentTab === 'about') && <SingleTournamentAbout tournament={tournament}/>}
                            { (currentTab === 'participants') && <div className="pb104">
                                <div className="tournament__content">
                                    <div className="tournament__fund">
                                        <div className="tournament__fund-top both-borders">
                                            <h2 className="tournament__fund-heading">{__('Свободные слоты')}</h2>
                                            <div className="tournament__fund-number">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>{(slots >= 0 ? slots : 0)} {__(getSlotWord(slots >= 0 ? slots : 0))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Участники турнира')}</h2>
                                    </div>
                                    <TournamentRating tournament={tournament} type={'users'} refetch={refetch}/>
                                </div>
                            </div> }
                            { (currentTab === 'rating') && <div className="pb104">
                                <div className="tournament__content">
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Результаты турнира')}</h2>
                                    </div>
                                    <TournamentRating tournament={tournament} type={'rating'} refetch={refetch}/>
                                </div>
                            </div> }
                            { (currentTab === 'rules') && <div className="tournament pb104">
                                <div className="tournament__content">
                                    <div className="tournament__block">
                                        <h2 className="tournament__block-subheading">{__('Правила турнира')}</h2>
                                        <p className="tournament__block-text">{parseUrls(_f(tournament, 'descRules'))}</p>
                                    </div>
                                </div>
                            </div> }
                        </div>
                    </div>
                </div>
            </div>
            <TeamRegisterPopup
                tournament={tournament}
                isRegisterFormActive={isRegisterFormActive}
                setIsRegisterFormActive={setIsRegisterFormActive}
                refetchHandler={setRefetch}
            /></>}
            <Footer/>
        </div>
    )
}