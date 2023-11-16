import React, {useCallback, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";
import {IParticipant, ITournament} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {getFile} from "../../functions/getFile";

export const AMOUNT_ROUNDS = 5

const TournamentRating = ({tournament}: {
    tournament: ITournament | null
}) => {
    const [participants, setParticipants] = useState<Array<IParticipant>>([])
    const {request, error, clearError} = useHttp()

    const fetchParticipants = useCallback(async () => {
        if (tournament && tournament.id) {
            const {participants} = await request(`/api/tournament/get-participants?tournamentId=${tournament.id}`, 'GET')
            setParticipants(participants)
        }
    }, [tournament])

    useEffect(() => {
        fetchParticipants().catch()
    }, [tournament])

    if (!tournament) {
        return (<></>)
    }

    return (
        <div className="rating">
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
                        const players = participant.users.length
                        const roundsInfo = []
                        const killAmounts = Array(players).fill(0)

                        for (let i = 0; i < AMOUNT_ROUNDS; i++) {
                            const currentRoundInfo: Array<JSX.Element> = []
                            let currentRoundPoints = 0
                            for (let j = 0; j < players; j++) {
                                currentRoundInfo.push(<div className="text">{participant.dataArray[j][i]}</div>)
                                killAmounts[j] += participant.dataArray[j][i]
                                currentRoundPoints += participant.dataArray[j][i]
                            }
                            roundsInfo.push(<td>
                                <div className="text">{currentRoundPoints} {__('очков')}</div>
                                {currentRoundInfo}
                            </td>)
                        }

                        return (<tr key={participant.id}>
                            <td>{index + 1}</td>
                            <td className="rating__team">
                                <div className="rating__team-flex">
                                    <div className="rating__team-images">
                                        <img src={getFile(participant.avatar) || DefaultUserPic} alt="nickname"/>
                                    </div>
                                    <div className="rating__team-nicks">
                                        <div className="bold flex">
                                            <span>{participant.title}</span>
                                            {/*<NavLink to={'MultiTwitch'}>*/}
                                            {/*    <img src={icons.video} alt="MultiTwitch"/>*/}
                                            {/*</NavLink>*/}
                                        </div>
                                        {participant.users && participant.users.map((reqUser) => (
                                            <div className="text flex">
                                                <span>{reqUser.nickname}</span>
                                                <img src={icons[reqUser?.platform || 'pc']} alt="User platform"/>
                                                {/*<NavLink to={'userTwitch'}>*/}
                                                {/*    <img src={icons.twitchUser} alt="User twitch"/>*/}
                                                {/*</NavLink>*/}
                                            </div>))}
                                    </div>
                                </div>
                            </td>
                            {roundsInfo}
                            <td>
                                <div className="bold">{participant.points} {__('очков')}</div>
                                {participant.users.map((_, index) => (<div className="bold">{killAmounts[index]}</div>))}
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TournamentRating;