import React, {useContext, useState} from 'react';
import {__} from "../../../multilang/Multilang";
import DefaultUserPic from "../../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../../data/PlatformIcons";
import {IMessageOptions, IParticipant, ITournament} from "../../../StoreTypes";
import {useHttp} from "../../../hooks/http.hook/http-hook";
import {getFile} from "../../../functions/getFile";
import {AuthContext} from "../../../context/AuthContext";
import {isUserAdmin} from "../../../functions/isUserAdmin";
import {participantHooks, useParticipants} from "./hooks";
import {isUserInParticipant, useTournamentLiveEdit} from "./helpers";
import {useTournamentRatingButtons} from "./parts/TournamentRatingButtons";
import {Dropdown} from "../../base/Dropdown";
import {PlayerCurrentRoundInfo, PlayerCurrentRoundPlaces} from "./parts/PlayerCurrentRoundInfo";
import {ParticipantRequestPopup} from "./parts/ParticipantRequestPopup";
import {AdminParticipantRequest} from "./parts/AdminParticipantRequest";

export const AMOUNT_ROUNDS = 5
export const DEFAULT_ROUNDS_HIDDEN = Array(AMOUNT_ROUNDS).fill(false)

export const TournamentRating = ({tournament, type, refetch}: {
    tournament: ITournament | null,
    type?: 'users' | 'rating',
    refetch?: boolean
}) => {
    const {user, token} = useContext(AuthContext)
    const {participants, setParticipants, manualRefetch, changeCertainParticipant} = useParticipants(tournament, type, refetch);
    const [isParticipantPopupActive, setIsParticipantPopupActive] = useState(false);
    const [currentParticipant, setCurrentParticipant] = useState<IParticipant | null>(null)
    const [isAdminParticipantRequestActive, setIsAdminParticipantRequestActive] = useState(false)

    const {
        setParticipantPlayerKills,
        setParticipantPlaces,
        setRoundsHidden
    } = useTournamentLiveEdit(participants, setParticipants);

    const [isEditActive, setIsEditActive] = useState<boolean>(false)

    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const maxRoomNumber = (tournament) ? Math.floor(tournament.maxUsers / tournament.playersInTeam) : 0
    const {request, loading} = useHttp()
    const {
        changePayStatus,
        redeclareRoomNumber,
        unregisterParticipant,
        increasePriority,
        saveHandler
    } = participantHooks(request, participants, setParticipants, manualRefetch, setMessageOptions, setIsEditActive, token);

    const {editButton, saveOrDiscardButton} = useTournamentRatingButtons(isEditActive, setIsEditActive, user, loading, {saveHandler})

    if (!tournament) {
        return (<></>)
    }
    return (
        <>
            <div className="rating">
                {editButton}
                {saveOrDiscardButton}
                {user && (isUserAdmin(user)) && messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>
                    {__(messageOptions.text)}
                </div>}
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>{__('Никнейм игрока')}</th>
                        <th>{__('Игра№')} 1</th>
                        <th>{__('Игра№')} 2</th>
                        <th>{__('Игра№')} 3</th>
                        <th>{__('Игра№')} 4</th>
                        <th>{__('Игра№')} 5</th>
                        <th>{__('Итого')}</th>
                        {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && <th></th>}
                    </tr>
                    </thead>
                    <tbody>
                    {participants.map((participant, index) => {
                        const players = participant.users.length
                        const roundsInfo = []
                        const killAmounts = Array(players).fill(0)
                        let amountPoints = 0

                        if (participant.roomNumber > maxRoomNumber && type !== 'users') {
                            return <></>
                        }

                        for (let i = 0; i < AMOUNT_ROUNDS; i++) {
                            const currentRoundInfo: Array<JSX.Element> = []
                            let currentRoundPoints = participant.places[i][1] || 0
                            for (let j = 0; j < players; j++) {
                                currentRoundInfo.push(PlayerCurrentRoundInfo(
                                    participant,
                                    isEditActive,
                                    setParticipantPlayerKills,
                                    index,
                                    i,
                                    j,
                                ))
                                if (!(participant.isRoundsHidden.length && participant.isRoundsHidden[i])) {
                                    killAmounts[j] += participant.dataArray[j][i] || 0
                                }
                                currentRoundPoints += participant.dataArray[j][i] || 0
                            }
                            if (!(participant.isRoundsHidden.length && participant.isRoundsHidden[i])) {
                                amountPoints += currentRoundPoints
                            }
                            roundsInfo.push(<td key={`round-${i}`} className={(participant.isRoundsHidden.length && participant.isRoundsHidden[i]) ? 'transparent' : ''}>
                                <div className="text">{currentRoundPoints} {__('очков')}</div>
                                <div className="flex">
                                    <div>
                                        {currentRoundInfo}
                                    </div>
                                    {PlayerCurrentRoundPlaces(participant, isEditActive, setParticipantPlaces, index, i)}
                                </div>
                                {isEditActive && <label
                                    className={!(participant.isRoundsHidden.length && participant.isRoundsHidden[i]) ? "admin__checkbox active" : "admin__checkbox"}
                                    onClick={e => setRoundsHidden(index, i)}
                                >
                                    <span className="admin__checkbox-rect"></span>
                                    <span className="admin__checkbox-label">{__(!(participant.isRoundsHidden.length && participant.isRoundsHidden[i]) ? "Скрыть" : "Показать")}</span>
                                </label>}
                            </td>)
                        }

                        return (<tr key={participant.id} className={(participant.roomNumber > maxRoomNumber) ? 'reserve' : ''}>
                            <td>
                                {type === 'users' && <span>{participant.roomNumber || (index + 1)}</span>}
                                {type !== 'users' && <span>{index + 1}</span>}
                            </td>
                            <td className="rating__team">
                                {participant.roomNumber > maxRoomNumber && <p className="text" style={{marginBottom: '8px'}}>{__('Резерв')}</p>}
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
                                        {!isUserAdmin(user) && isUserInParticipant(participant, user) && !participant.participant_request?.id && <>
                                            <button
                                                className="button-both-accent corner-margin mt12"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setIsParticipantPopupActive(true)
                                                }}
                                            >
                                                {__('Опубликовать результаты')}
                                            </button>
                                        </>}
                                        {isUserAdmin(user) && participant.participant_request?.status === 'new' && <>
                                            <button
                                                className="button-both-accent corner-margin mt12"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentParticipant(participant)
                                                    setIsAdminParticipantRequestActive(true)
                                                }}
                                            >
                                                {__('Смотреть подтверждение')}
                                            </button>
                                        </>}
                                        {!isUserAdmin(user) && isUserInParticipant(participant, user) && participant.participant_request?.status === 'new' && <>
                                            <div className="text" style={{marginTop: '12px'}}>{__('Результаты отправлены')}</div>
                                        </>}
                                        {isUserAdmin(user) && <div className={`${participant.isPaid ? 'pos' : 'neg'}-message mt12`}>
                                            {__(participant.isPaid ? 'Оплачено' : 'Не оплачено')}
                                            <br/>
                                            {participant.payMethod}
                                        </div>}
                                    </div>
                                </div>
                            </td>
                            {participant.roomNumber <= maxRoomNumber && <>
                                {roundsInfo}
                                <td>
                                    <div
                                        className="bold">{isEditActive ? amountPoints : participant.points} {__('очков')}</div>
                                    {participant.users.map((reqUser, index) => (
                                        <div className="bold"
                                             key={`killAmount-${reqUser.id}`}>{killAmounts[index]}</div>))}
                                </td>
                            </>}
                            {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && <td>
                                <Dropdown options={[
                                    {
                                        label: 'Удалить участника',
                                        icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>,
                                        onClick: () => {
                                            unregisterParticipant(participant.id).catch(() => {})
                                        }
                                    },
                                    {
                                        label: 'Переопределить номер',
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M14.1667 1.66666L17.5 4.99999M17.5 4.99999L14.1667 8.33332M17.5 4.99999H5.83333C4.94928 4.99999 4.10143 5.35118 3.47631 5.9763C2.85119 6.60142 2.5 7.44927 2.5 8.33332V9.16666M5.83333 18.3333L2.5 15M2.5 15L5.83333 11.6667M2.5 15H14.1667C15.0507 15 15.8986 14.6488 16.5237 14.0237C17.1488 13.3986 17.5 12.5507 17.5 11.6667V10.8333" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>,
                                        onClick: () => {
                                            redeclareRoomNumber(participant.id).catch(() => {})
                                        }
                                    },
                                    {
                                        label: 'Изменить статус оплаты',
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M14.1667 1.66666L17.5 4.99999M17.5 4.99999L14.1667 8.33332M17.5 4.99999H5.83333C4.94928 4.99999 4.10143 5.35118 3.47631 5.9763C2.85119 6.60142 2.5 7.44927 2.5 8.33332V9.16666M5.83333 18.3333L2.5 15M2.5 15L5.83333 11.6667M2.5 15H14.1667C15.0507 15 15.8986 14.6488 16.5237 14.0237C17.1488 13.3986 17.5 12.5507 17.5 11.6667V10.8333" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>,
                                        onClick: () => {
                                            changePayStatus(participant.id).catch(() => {})
                                        }
                                    },
                                    {
                                        label: 'Повысить в рейтинге',
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M18.3346 5.83331L11.2513 12.9166L7.08464 8.74998L1.66797 14.1666M18.3346 5.83331H13.3346M18.3346 5.83331V10.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>,
                                        onClick: () => {
                                            increasePriority(participant.id).catch(() => {})
                                        }
                                    }
                                ]}/>
                            </td>}
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
            {currentParticipant && <AdminParticipantRequest
                participant={currentParticipant}
                onHide={() => setIsAdminParticipantRequestActive(false)}
                isActive={isAdminParticipantRequestActive}
                manualRefetch={manualRefetch}
            />}
            <ParticipantRequestPopup isActive={isParticipantPopupActive} onHide={() => setIsParticipantPopupActive(false)} participants={participants} changeCertainParticipant={changeCertainParticipant}/>
        </>
    );
};

export default TournamentRating;
