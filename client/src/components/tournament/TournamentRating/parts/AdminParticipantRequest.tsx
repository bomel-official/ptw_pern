import React, {useContext, useEffect, useState} from 'react';
import {Popup} from "../../../base/Popup";
import {getFile} from "../../../../functions/getFile";
import DefaultUserPic from "../../../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../../../data/PlatformIcons";
import {__} from "../../../../multilang/Multilang";
import Loader from "../../../base/Loader";
import {IMessageOptions, IParticipant} from "../../../../StoreTypes";
import {AMOUNT_ROUNDS} from "../TournamentRating";
import {useAdminPlayerRequest} from "../hooks";
import {AuthContext} from "../../../../context/AuthContext";

export const AdminParticipantRequest = ({participant, isActive, onHide, manualRefetch}: {participant: IParticipant, isActive: boolean, onHide: () => void, manualRefetch: () => void}) => {
    const participantRequest = participant.participant_request
    const {token} = useContext(AuthContext);

    const {loading, error, discardRequest, approveRequest} = useAdminPlayerRequest(participant, token)
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    useEffect(() => {
        if (error) {
            setMessageOptions({status: 'neg', text: error})
        }
    }, [error])

    if (!participant) return (<></>);
    if (!participantRequest) return (<></>);

    const players = participant.users.length
    const roundsInfo = []
    const killAmounts = Array(players).fill(0)
    let amountPoints = 0

    for (let i = 0; i < AMOUNT_ROUNDS; i++) {
        const currentRoundInfo: Array<JSX.Element> = []
        let currentRoundPoints = participantRequest.places[i][1] || 0
        for (let j = 0; j < players; j++) {
            currentRoundInfo.push(<div className="text" key={`player-${j}-${i}`}>
                <span>{participantRequest.dataArray[j][i]}</span>
            </div>)
            killAmounts[j] += participantRequest?.dataArray[j][i] || 0
            currentRoundPoints += participantRequest?.dataArray[j][i] || 0
        }
        amountPoints += currentRoundPoints
        roundsInfo.push(<td key={`round-${i}`}>
            <div className="text">{currentRoundPoints} {__('очков')}</div>
            <div className="flex">
                <div>
                    {currentRoundInfo}
                </div>
            </div>
        </td>)
    }

    return (
        <Popup isActive={isActive} onHide={onHide} title={'Подтвержение результатов'} width="1280px" height="calc(100% - 30px)" overflow="auto">
            <div className="image-wrapper mt24" style={{
                flexGrow: 1
            }}>
                <img src={getFile(participantRequest.approveUrl)} alt="Approve" style={{
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center'
                }}/>
            </div>
        </Popup>
    );
};