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
        <Popup isActive={isActive} onHide={onHide} title={'Опубликовать результаты'} width="1280px" height="calc(100% - 30px)" overflow="auto">
            <div className="rating">
                <table>
                    <tbody>
                    <tr>
                        <td className="rating__team">
                            <div className="rating__team-flex">
                                <div className="rating__team-images">
                                    <img src={(participant.team && getFile(participant.team.avatar)) ? getFile(participant.team.avatar) : DefaultUserPic} alt="nickname"/>
                                </div>
                                <div className="rating__team-nicks">
                                    <div className="bold flex">
                                        <span>{participant.team ? participant.team.name : 'Команда распущена...'}</span>
                                        <NavLink
                                            target='_blank'
                                            to={`https://www.multitwitch.tv/${participant.users.map((user) => user.twitch).join('/')}`}
                                            className="multitwitch"
                                        >
                                            <img src={icons.video} alt="MultiTwitch"/>
                                        </NavLink>
                                    </div>
                                    {participant.users && participant.users.map((reqUser) => (
                                        <NavLink to={`/profile/${reqUser.nickname}`} className="text flex" key={`user-${reqUser.id}`}>
                                            <img src={icons[reqUser?.platform || 'pc']} alt="User platform"/>
                                            <img src={icons[reqUser?.device || 'km']} alt="User device"/>
                                            <span>{reqUser.nickname}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </td>
                        {roundsInfo}
                        <td>
                            <div
                                className="bold"
                            >
                                {amountPoints} {__('очков')}
                            </div>
                            {participant.users.map((reqUser, index) => (
                                <div className="bold"
                                     key={`killAmount-${reqUser.id}`}
                                >
                                    {killAmounts[index]}
                                </div>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex mt24" style={{flexDirection: 'column', alignItems: 'stretch', gap: '8px'}}>
                {!loading && <div className="flex" style={{gap: '8px'}}>
                    <button className="button-tl-accent corner-margin" onClick={async () => {
                        const res = await approveRequest()
                        if (res) {
                            onHide()
                            manualRefetch()
                        }
                    }}>{__('Подтвердить')}</button>
                    <button className="button-br-gray corner-margin" onClick={async () => {
                        const res = await discardRequest()
                        if (res) {
                            onHide()
                            manualRefetch()
                        }
                    }}>{__('Отменить')}</button>
                </div>}
                {loading && <Loader/>}
                {messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>
                    {__(messageOptions.text)}
                </div>}
            </div>
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