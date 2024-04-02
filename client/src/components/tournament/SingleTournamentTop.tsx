import React, {JSX, useContext} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {getDateString} from "../../functions/getDateString";
import {NavLink} from "react-router-dom";
import {ITournament} from "../../StoreTypes";
import {AuthContext} from "../../context/AuthContext";
import {getTournamentAdditionalFields} from "../../functions/getTournamentAdditionalFields";

const SingleTournamentTop = ({tournament, registerHTML}: {tournament: ITournament, registerHTML: JSX.Element}) => {
    const {user} = useContext(AuthContext)
    const {amountPlayers} = getTournamentAdditionalFields(tournament, user)

    const dateBegin = new Date(tournament?.dateBegin || 0)
    const dateEnd = new Date(tournament?.dateEnd || 0)

    return (
        <div className="side__top-flex">
            <div className="side__top-left">
                <div className="side__title">{_f(tournament, 'title')}</div>
                <div className="side__top-info">
                    <div className="side__top-info-item flex">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{amountPlayers} / {tournament.maxUsers} {__('участников')}</span>
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
                        <span>{tournament.participationPrice ? tournament.participationPrice + '₽ ' + __('за участие') : __('Свободное участие')}</span>
                    </div>
                </div>
            </div>
            <div className="side__top-right">
                <div className="side__top-reg-time">{__('Регистрация до')} {getDateString(dateBegin, 'dd.mm.yyyy h:i')}</div>
                <div className="side__top-buttons flex">
                    {registerHTML}
                    <NavLink to={tournament.twitchChannel} target="_blank" className="side__top-share">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.15833 11.2584L12.85 14.575M12.8417 5.42502L7.15833 8.74169M17.5 4.16669C17.5 5.5474 16.3807 6.66669 15 6.66669C13.6193 6.66669 12.5 5.5474 12.5 4.16669C12.5 2.78598 13.6193 1.66669 15 1.66669C16.3807 1.66669 17.5 2.78598 17.5 4.16669ZM7.5 10C7.5 11.3807 6.38071 12.5 5 12.5C3.61929 12.5 2.5 11.3807 2.5 10C2.5 8.61931 3.61929 7.50002 5 7.50002C6.38071 7.50002 7.5 8.61931 7.5 10ZM17.5 15.8334C17.5 17.2141 16.3807 18.3334 15 18.3334C13.6193 18.3334 12.5 17.2141 12.5 15.8334C12.5 14.4526 13.6193 13.3334 15 13.3334C16.3807 13.3334 17.5 14.4526 17.5 15.8334Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default SingleTournamentTop;