import React from "react";
import {IParticipant, IParticipantRequestDTO, IUser} from "../../../../StoreTypes";

export const PlayerCurrentRoundInfo = (
    participant: IParticipant,
    isEditActive: boolean,
    setParticipantPlayerKills: (index: number, i: number, j: number, value: number) => void,
    index: number,
    i: number,
    j: number,
) => {
    if (isEditActive) {
        return (
            <div className="text" key={`player-${j}-${i}`}>
                <input
                    className="input-text"
                    type="number"
                    value={participant.dataArray[j][i]}
                    onChange={(e) => setParticipantPlayerKills(index, i, j, parseFloat(e.target.value))}
                />
            </div>
        )
    } else {
        return (
            <div className="text" key={`player-${j}-${i}`}>
                <span>{participant.dataArray[j][i]}</span>
            </div>
        )
    }
}

export const PlayerCurrentRoundPlaces = (
    participant: IParticipant,
    isEditActive: boolean,
    setParticipantPlaces: (index: number, i: number, item: 0 | 1, value: number) => void,
    index: number,
    i: number
) => {
    if (isEditActive) {
        return (
            <div className="rating__place">
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
                    onChange={(e) => setParticipantPlaces(index, i, 1, parseFloat(e.target.value))}
                />
            </div>
        )
    } else if (participant.places[i][0] > 0) {
        return (
            <div className="rating__place">{participant.places[i][0]}</div>
        )
    }
    return (<></>)
}