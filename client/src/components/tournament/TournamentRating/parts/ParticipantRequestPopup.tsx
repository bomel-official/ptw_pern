import React, { ChangeEvent, FC, useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { icons } from "../../../../data/PlatformIcons";
import { getFile } from "../../../../functions/getFile";
import { __ } from "../../../../multilang/Multilang";
import DefaultUserPic from "../../../../static/icons/USERPIC.png";
import { IMessageOptions, IParticipant } from "../../../../StoreTypes";
import Loader from "../../../base/Loader";
import { Popup } from "../../../base/Popup";
import { useParticipantRequest } from "../hooks";
import { AMOUNT_ROUNDS } from "../TournamentRating";

export const ParticipantRequestPopup: FC<{
    isActive: boolean, onHide: () => void, participants: Array<IParticipant>, changeCertainParticipant: ( index: number,
                                                                                                          value: IParticipant ) => void
}> = ( { isActive, onHide, participants, changeCertainParticipant } ) => {
    const { user, token } = useContext( AuthContext );
    const {
        setParticipantRequestPlaces,
        setParticipantRequestPlayerKills,
        participantRequest,
        participant,
        changeParticipantRequestField,
        pIndex,
        saveHandler,
        loading
    } = useParticipantRequest( participants, user, token );
    const [ messageOptions, setMessageOptions ] = useState<IMessageOptions>( {
        status: "", text: ""
    } );

    if ( !participant ) return (<></>);
    if ( !participantRequest ) return (<></>);

    const players = participant.users.length;
    const roundsInfo = [];
    const killAmounts = Array( players ).fill( 0 );
    let amountPoints = 0;

    for ( let i = 0; i < AMOUNT_ROUNDS; i++ ) {
        const currentRoundInfo: Array<JSX.Element> = [];
        let currentRoundPoints = participantRequest.places[i][1] || 0;
        for ( let j = 0; j < players; j++ ) {
            currentRoundInfo.push( <div className="text" key={ `player-${ j }-${ i }` }>
                <input
                    className="input-text"
                    type="number"
                    value={ participantRequest?.dataArray[j][i] }
                    onChange={ ( e ) => setParticipantRequestPlayerKills( i, j, parseFloat( e.target.value ) ) }
                />
            </div> );
            if ( !(participantRequest?.isRoundsHidden.length && participantRequest.isRoundsHidden[i]) ) {
                killAmounts[j] += participantRequest?.dataArray[j][i] || 0;
            }
            currentRoundPoints += participantRequest?.dataArray[j][i] || 0;
        }
        if ( !(participantRequest?.isRoundsHidden.length && participantRequest?.isRoundsHidden[i]) ) {
            amountPoints += currentRoundPoints;
        }
        roundsInfo.push( <td key={ `round-${ i }` } className={ (participantRequest?.isRoundsHidden.length &&
            participantRequest?.isRoundsHidden[i]) ? "transparent" : "" }>
            <div className="text">{ currentRoundPoints } { __( "очков" ) }</div>
            <div className="flex">
                <div>
                    { currentRoundInfo }
                </div>
            </div>
        </td> );
    }

    return (
        <Popup isActive={ isActive } onHide={ onHide } title={ "Опубликовать результаты" } width="1280px">
            <div className="rating">
                <table>
                    <tbody>
                    <tr>
                        <td className="rating__team">
                            <div className="rating__team-flex">
                                <div className="rating__team-images">
                                    <img src={ (participant.team && getFile( participant.team.avatar )) ?
                                        getFile( participant.team.avatar ) : DefaultUserPic } alt="nickname"/>
                                </div>
                                <div className="rating__team-nicks">
                                    <div className="bold flex">
                                        <span>{ participant.team ? participant.team.name :
                                            "Команда распущена..." }</span>
                                        <NavLink
                                            target="_blank"
                                            to={ `https://www.multitwitch.tv/${ participant.users.map(
                                                ( user ) => user.twitch ).join( "/" ) }` }
                                            className="multitwitch"
                                        >
                                            <img src={ icons.video } alt="MultiTwitch"/>
                                        </NavLink>
                                    </div>
                                    { participant.users && participant.users.map( ( reqUser ) => (
                                        <NavLink to={ `/profile/${ reqUser.nickname }` } className="text flex"
                                                 key={ `user-${ reqUser.id }` }>
                                            <img src={ icons[reqUser?.platform || "pc"] } alt="User platform"/>
                                            <img src={ icons[reqUser?.device || "km"] } alt="User device"/>
                                            <span>{ reqUser.nickname }</span>
                                        </NavLink>
                                    ) ) }
                                </div>
                            </div>
                        </td>
                        { roundsInfo }
                        <td>
                            <div
                                className="bold"
                            >
                                { amountPoints } { __( "очков" ) }
                            </div>
                            { participant.users.map( ( reqUser, index ) => (
                                <div className="bold"
                                     key={ `killAmount-${ reqUser.id }` }
                                >
                                    { killAmounts[index] }
                                </div>
                            ) ) }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex mt24" style={ { flexDirection: "column" } }>
                <div className="flex" style={ { flexDirection: "column", alignItems: "stretch", gap: "8px" } }>
                    <label htmlFor="teamAvatarImage" className="fileInput input-tl corner-margin">
                        <span className="fileInput__text">{ participantRequest.approveFilename ?
                            participantRequest.approveFilename : __( "Добавить подтверждение" ) }</span>
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
                            style={ { padding: 0 } }
                            onChange={ ( e: ChangeEvent<HTMLInputElement> ) => changeParticipantRequestField( "approve",
                                e.target["files"] ? e.target["files"][0] : null ) }
                        />
                    </label>
                    { !loading && <button className="button-br-accent corner-margin" onClick={ async ( e ) => {
                        e.preventDefault();
                        if ( !participant ) return;
                        const saveResponse = await saveHandler();
                        if ( typeof saveResponse === "string" ) {
                            setMessageOptions( { status: "neg", text: saveResponse } );
                        } else {
                            onHide();
                            changeCertainParticipant( pIndex, { ...participant, participant_request: saveResponse } );
                        }
                    } }>{ __( "Отправить" ) }</button> }
                    { loading && <Loader/> }
                    { messageOptions.text && <div className={ `${ messageOptions.status }-message mb24` }>
                        { __( messageOptions.text ) }
                    </div> }
                </div>
            </div>
        </Popup>
    );
};
