import React, { ChangeEvent, Dispatch, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { icons } from "../../data/PlatformIcons";
import { getFile } from "../../functions/getFile";
import { __ } from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { IMessageOptions, ITeam, IUser } from "../../StoreTypes";
import { Popup } from "./Popup";

const TeamEditPopup = (
    {
        newTeamUsed,
        isEditTeamFormActive,
        setIsEditTeamFormActive,
        saveTeamToEdit,
        currentStep,
        setCurrentStep,
        messageOptions
    }: {
        newTeamUsed: any,
        isEditTeamFormActive: boolean,
        setIsEditTeamFormActive: Dispatch<boolean>,
        saveTeamToEdit: ( team: ITeam ) => void,
        currentStep: number,
        setCurrentStep: Dispatch<number>,
        messageOptions: IMessageOptions
    } ) => {
    const [ isDropdownActive, setIsDropdownActive ] = useState<boolean>( false );
    const { user } = useContext( AuthContext );

    const {
        newTeam,
        changeNewTeam,
        setSearch,
        search,
        playersSearch,
        changeNewTeamPlayers,
        clearNewPlayersSearch,
        isUserIdIncluded,
        reduceNewTeam
    } = newTeamUsed;

    useEffect( () => {
        if ( user && user.id ) {
            if ( !newTeam.capitanId || newTeam.players.length === 0 ) {
                reduceNewTeam( { type: "changeField", data: { name: "capitanId", value: user.id } } );
                reduceNewTeam( { type: "changeField", data: { name: "players", value: [ user ] } } );
            }
        }
    }, [ newTeam, user ] );

    return (
        <Popup
            isActive={ isEditTeamFormActive }
            onHide={ () => setIsEditTeamFormActive( false ) }
            title={ __( "Редактировать команду" ) }
        >
            <div className="popup__smallText mb8">
                { currentStep === 0 && __( "Шаг 1. Название и изображение" ) }
                { currentStep === 1 && __( "Шаг 2. Состав" ) }
            </div>
            <div className="popup__progressbar mb12">
                <div className="popup__progressbar-value"
                     style={ { width: `${ (currentStep / 2 * 100).toFixed( 2 ) }%` } }></div>
            </div>
            { currentStep === 0 &&
                <>
                    <label htmlFor="teamName" className="input-tl mb12">
                        <input
                            type="text"
                            name="name"
                            id="teamName"
                            placeholder={ __( "Введите название" ) }
                            value={ newTeam.name || "" }
                            onChange={ ( e: ChangeEvent<HTMLInputElement> ) => changeNewTeam( e.target.name,
                                e.target.value ) }
                        />
                    </label>
                    <label htmlFor="teamAvatarImage" className="fileInput input mb32">
                        <span className="fileInput__text">{ newTeam.avatar ? __( "Изменить аватар" ) :
                            __( "Загрузить аватар" ) }</span>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z"
                                stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            name="avatar"
                            id="teamAvatarImage"
                            onChange={ ( e: ChangeEvent<HTMLInputElement> ) => changeNewTeam(
                                e.target.name,
                                (e.target.files && e.target.files.length) ? e.target.files[0] : null
                            ) }
                        />
                    </label>
                    <button
                        className="button-both-accent popup__accentButton"
                        onClick={ () => setCurrentStep( currentStep + 1 ) }
                    >
                        <span>{ __( "Продолжить" ) }</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white"
                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </>
            }
            { currentStep === 1 &&
                <>
                    <div className="dropdown mb24">
                        <div className="popup__smallText mb8 c-textTransparentWhite">{ __(
                            "Пользователи должны быть у вас в друзьях" ) }</div>
                        <label
                            className="dropdown__current"
                            onClick={ () => setIsDropdownActive( !isDropdownActive ) }
                        >
                            <input
                                type="text"
                                name="nickname"
                                placeholder={ __( "Никнейм игрока" ) }
                                onChange={ ( e: ChangeEvent<HTMLInputElement> ) => {
                                    setSearch( e.target.value );
                                } }
                                value={ search }
                            />
                        </label>
                        <ul className={ playersSearch && playersSearch.length ? "dropdown__values active" :
                            "dropdown__values" }>
                            { playersSearch.map( ( player: IUser ) => (
                                (user && player.id !== user.id && !isUserIdIncluded( player.id )) &&
                                <li className="dropdown__value" key={ player.id }>
                                    <button
                                        onClick={ () => {
                                            changeNewTeamPlayers( player, "add" );
                                            clearNewPlayersSearch();
                                        } }
                                    >
                                        <div className="profileCard">
                                            <img src={ getFile( player.avatar ) || DefaultUserPic }
                                                 alt={ player.nickname } className="profileCard__avatar"/>
                                            <div className="profileCard__top">
                                                <span className="profileCard__nickname">{ player.nickname }</span>
                                                <img src={ icons[player.platform || "pc"] } alt="User platform"/>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ) ) }
                        </ul>
                    </div>
                    { newTeam.players.length !== 0 && <>
                        <h4 className="popup__subtitle mb12">{ __( "Состав команды" ) }</h4>
                        <ul className="popup__players mb32">
                            { newTeam.players.map( ( player: IUser, index: number ) => (
                                <li className="popup__player" key={ index }>
                                    <div className="profileCard">
                                        <img src={ getFile( player.avatar ) || DefaultUserPic } alt={ player.nickname }
                                             className="profileCard__avatar"/>
                                        <div className="profileCard__top">
                                            <span className="profileCard__nickname">{ player.nickname }</span>
                                            <img src={ icons[player?.platform || "pc"] } alt="User platform"/>
                                        </div>
                                    </div>
                                    { user && player.id !== user.id && <button
                                        className="popup__player-cross"
                                        onClick={ () => {
                                            changeNewTeamPlayers( player, "remove" );
                                        } }
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke="white"
                                                  strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                        </svg>
                                    </button> }
                                </li>
                            ) ) }
                        </ul>
                    </> }
                    { messageOptions.text && <div className={ `${ messageOptions.status }-message mb24` }>{ __(
                        messageOptions.text ) }</div> }
                    <div className="popup__buttons">
                        <button
                            className="button-tl-gray popup__grayButton"
                            onClick={ () => setCurrentStep( currentStep - 1 ) }
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.832 9.99933H4.16532M4.16532 9.99933L9.99872 4.16602M4.16532 9.99933L9.99872 15.8327"
                                    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{ __( "Назад" ) }</span>
                        </button>
                        <button
                            className="button-br-accent popup__accentButton"
                            onClick={ () => saveTeamToEdit( newTeam ) }
                        >
                            <span>{ __( "Сохранить" ) }</span>
                        </button>
                    </div>
                </>
            }
        </Popup>
    );
};

export default TeamEditPopup;
