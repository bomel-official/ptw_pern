import React, {useCallback, useContext, useEffect, useState} from 'react';
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
                    </tr>
                    </thead>
                    <tbody>
                    {participants.map((participant, index) => {
                        if (!participant || !participant.team) {
                            return (<></>)
                        }
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
                                <div className="rating__team-flex">
                                    <div className="rating__team-images">
                                        <img src={getFile(participant.team.avatar) || DefaultUserPic} alt="nickname"/>
                                    </div>
                                    <div className="rating__team-nicks">
                                        <div className="bold flex">
                                            <span>{participant.team.name}</span>
                                        </div>
                                        {participant.users && participant.users.map((reqUser) => (
                                            <div className="text flex" key={`user-${reqUser.id}`}>
                                                <span>{reqUser.nickname}</span>
                                                <img src={icons[reqUser?.platform || 'pc']} alt="User platform"/>
                                                <img src={icons[reqUser?.device || 'km']} alt="User device"/>
                                            </div>))}
                                    </div>
                                </div>
                            </td>
                            {roundsInfo}
                            <td>
                                <div className="bold">{isEditActive ? amountPoints : participant.points} {__('очков')}</div>
                                {participant.users.map((reqUser, index) => (
                                    <div className="bold" key={`killAmount-${reqUser.id}`}>{killAmounts[index]}</div>))}
                            </td>
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TournamentRating;