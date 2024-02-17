import React from 'react';
import {__, _c, _f, _n} from "../../multilang/Multilang";
import {Games} from "../../data/Games";
import {getSlotWord} from "../../data/Translations";
import {NavLink} from "react-router-dom";
import {ITournament} from "../../StoreTypes";
import {getTournamentAdditionalFields} from "../../functions/getTournamentAdditionalFields";
import {parseUrls} from "../../functions/parseUrls";

const SingleTournamentAbout = ({tournament}: {tournament: ITournament}) => {
    const {slots} = getTournamentAdditionalFields(tournament)

    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <div className="tournament__fund">
                    <div className="tournament__fund-top">
                        <h2 className="tournament__fund-heading">{__('Призовой фонд')}</h2>
                        <div className="tournament__fund-number">{_n(tournament.prizes)} {_c()}</div>
                    </div>
                    <div className="tournament__fund-bottom grid c3">
                        <div className="tournament__fund-item">
                            <h3 className="tournament__fund-item-place">1 {__('место')}</h3>
                            <div className="tournament__fund-item-prize">{_n(tournament.prize_1)} {_c()}</div>
                        </div>
                        <div className="tournament__fund-item">
                            <h3 className="tournament__fund-item-place">2 {__('место')}</h3>
                            <div className="tournament__fund-item-prize">{_n(tournament.prize_2)} {_c()}</div>
                        </div>
                        <div className="tournament__fund-item">
                            <h3 className="tournament__fund-item-place">3 {__('место')}</h3>
                            <div className="tournament__fund-item-prize">{_n(tournament.prize_3)} {_c()}</div>
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
                                <span>{tournament ? Games[tournament.game].name : Games["warzone"].name}</span>
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
                    <p className="tournament__block-text">{parseUrls(_f(tournament, 'descAdditional'))}</p>
                </div>
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
                                <span>{(slots >= 0 ? slots : 0)} {__(getSlotWord(slots >= 0 ? slots : 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <NavLink to={`/tournament/${tournament.slug}/participants`}
                         className="tournament__participants-link">{__('Смотреть участников')}</NavLink>
            </div>
        </div>
    );
};

export default SingleTournamentAbout;