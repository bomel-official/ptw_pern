import React, {MouseEvent, useCallback, useContext, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";
import {IMessageOptions, IParticipant, ITournament} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {getFile} from "../../functions/getFile";
import {AuthContext} from "../../context/AuthContext";

export const AMOUNT_ROUNDS = 5

const TournamentRating = ({tournament}: {
    tournament: ITournament | null
}) => {
    const [participants, setParticipants] = useState<Array<IParticipant>>([])
    const [isEditActive, setIsEditActive] = useState<boolean>(false)
    const {request, error, clearError} = useHttp()
    const {user, token} = useContext(AuthContext)
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    const fetchParticipants = useCallback(async () => {
        if (tournament && tournament.id) {
            const {participants: fetchedParticipants} = await request(`/api/tournament/get-participants?tournamentId=${tournament.id}`, 'GET')
            setParticipants(fetchedParticipants)
        }
    }, [tournament])

    useEffect(() => {
        fetchParticipants().catch()
    }, [tournament])

    const changeParticipant = (index: number, newParticipant: IParticipant) => {
        setParticipants(participants.map((ptsp, i) => {
            if (index === i) {
                return newParticipant
            }
            return ptsp
        }))
    }

    const setParticipantPlayerKills = (index: number, i: number, j: number, value: number) => {
        const newParticipant = {...participants[index]}
        newParticipant.dataArray[j][i] = value
        changeParticipant(index, newParticipant)
    }

    const setParticipantPlaces = (index: number, i: number, item: 0 | 1, value: number) => {
        const newParticipant = {...participants[index]}
        newParticipant.places[i][item] = value
        changeParticipant(index, newParticipant)
    }

    const unregisterParticipant = async (participantId: number) => {
        const {isOk} = await request(`/api/tournament/unregister`, 'POST', {participantId}, {
            Authorization: `Bearer ${token}`
        }, true)
        if (isOk) {
            setParticipants(participants.filter(ptsp => (ptsp.id !== participantId)))
        }
        return isOk
    }


    const saveHandler = async () => {
        try {
            const {isOk, message}: {isOk: boolean, message: string} = await request(
                '/api/tournament/edit-register',
                'POST',
                {participants: participants.map(p => ({dataArray: p.dataArray, places: p.places, id: p.id, players: p.users.length}))},
                {
                Authorization: `Bearer ${token}`
            }, true)
            setMessageOptions({
                status: isOk ? 'pos' : 'neg', text: message
            })
            if (isOk) {
                await fetchParticipants()
                setIsEditActive(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    if (!tournament) {
        return (<></>)
    }
    return (
        <>
            <div className="rating">
                {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && !isEditActive && <button className="button-both-accent mb8 corner-margin" onClick={() => setIsEditActive(true)}>
                    <span>{__('Редактировать')}</span>
                </button>}
                {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && isEditActive && <div className="flex pt12 pb12" style={{gap: '8px'}}>
                    <button
                        className="button-tl-accent mb8 corner-margin"
                        onClick={saveHandler}
                    >
                        <span>{__('Сохранить')}</span>
                    </button>
                    <button className="button-br-gray mb8 corner-margin" onClick={() => setIsEditActive(false)}>
                        <span>{__('Отмена')}</span>
                    </button>
                </div>}
                {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
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

                        for (let i = 0; i < AMOUNT_ROUNDS; i++) {
                            const currentRoundInfo: Array<JSX.Element> = []
                            let currentRoundPoints = participant.places[i][1] || 0
                            for (let j = 0; j < players; j++) {
                                currentRoundInfo.push(<div className="text" key={`player-${j}`}>
                                    {isEditActive && <input
                                        className="input-text"
                                        type="number"
                                        value={participant.dataArray[j][i]}
                                        onChange={(e) => setParticipantPlayerKills(index, i, j, parseInt(e.target.value))}
                                    />}
                                    {!isEditActive && <span>{participant.dataArray[j][i]}</span>}
                                </div>)
                                killAmounts[j] += participant.dataArray[j][i] || 0
                                currentRoundPoints += participant.dataArray[j][i] || 0
                            }
                            amountPoints += currentRoundPoints
                            roundsInfo.push(<td key={`round-${i}`}>
                                <div className="text">{currentRoundPoints} {__('очков')}</div>
                                <div className="flex">
                                    <div>
                                        {currentRoundInfo}
                                    </div>
                                    {participant.places[i][0] > 0 && !isEditActive &&
                                        <div className="rating__place">{participant.places[i][0]}</div>}
                                    {isEditActive && <div className="rating__place">
                                        <input
                                            className="input-text small"
                                            type="number"
                                            value={participant.places[i][0] || -1}
                                            onChange={(e) => setParticipantPlaces(index, i, 0, parseInt(e.target.value))}
                                        />
                                        <input
                                            className="input-text small"
                                            type="number"
                                            value={participant.places[i][1] || 0}
                                            onChange={(e) => setParticipantPlaces(index, i, 1, parseInt(e.target.value))}
                                        />
                                    </div>}
                                </div>
                            </td>)
                        }

                        return (<tr key={participant.id}>
                            <td>{index + 1}</td>
                            <td className="rating__team">
                                {participant.team && <div className="rating__team-flex">
                                    <div className="rating__team-images">
                                        <img src={getFile(participant.team.avatar) || DefaultUserPic} alt="nickname"/>
                                    </div>
                                    <div className="rating__team-nicks">
                                        <div className="bold flex">
                                            <span>{participant.team.name}</span>
                                        </div>
                                        {participant.users && participant.users.map((reqUser) => (
                                            <NavLink to={`/profile/${reqUser.nickname}`} className="text flex" key={`user-${reqUser.id}`}>
                                                <img src={icons[reqUser?.platform || 'pc']} alt="User platform"/>
                                                <img src={icons[reqUser?.device || 'km']} alt="User device"/>
                                                <span>{reqUser.nickname}</span>
                                            </NavLink>))}
                                    </div>
                                </div>}
                            </td>
                            {roundsInfo}
                            <td>
                                <div className="bold">{isEditActive ? amountPoints : participant.points} {__('очков')}</div>
                                {participant.users.map((reqUser, index) => (
                                    <div className="bold" key={`killAmount-${reqUser.id}`}>{killAmounts[index]}</div>))}
                            </td>
                            {user && (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && <td>
                                <div className={"dropdown dropdown-mini"}>
                                    <button
                                        className="dropdown__current"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault()
                                            e.currentTarget.parentElement?.classList.toggle('active')
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0007 10.8334C10.4609 10.8334 10.834 10.4603 10.834 10C10.834 9.53978 10.4609 9.16669 10.0007 9.16669C9.54041 9.16669 9.16732 9.53978 9.16732 10C9.16732 10.4603 9.54041 10.8334 10.0007 10.8334Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M15.834 10.8334C16.2942 10.8334 16.6673 10.4603 16.6673 10C16.6673 9.53978 16.2942 9.16669 15.834 9.16669C15.3737 9.16669 15.0007 9.53978 15.0007 10C15.0007 10.4603 15.3737 10.8334 15.834 10.8334Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M4.16732 10.8334C4.62755 10.8334 5.00065 10.4603 5.00065 10C5.00065 9.53978 4.62755 9.16669 4.16732 9.16669C3.70708 9.16669 3.33398 9.53978 3.33398 10C3.33398 10.4603 3.70708 10.8334 4.16732 10.8334Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <ul className="dropdown__values">
                                        <li className="dropdown__value">
                                            <button
                                                onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                                                    e.preventDefault()
                                                    const isOk = await unregisterParticipant(participant.id)
                                                    if (isOk) {
                                                        console.log(e.currentTarget.parentElement)
                                                        console.log(e.currentTarget.parentElement?.parentElement)
                                                        console.log(e.currentTarget.parentElement?.parentElement?.parentElement)
                                                        e.currentTarget.parentElement?.parentElement?.parentElement?.classList.toggle('active')
                                                    }
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>{__('Удалить участника')}</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </td>}
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TournamentRating;