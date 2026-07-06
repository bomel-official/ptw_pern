import React, { FC } from "react";
import { IParticipant } from "../../../../StoreTypes";
import { safeNumber } from "../rating-helpers";

interface PlayerCurrentRoundInfoProps {
    participant: IParticipant;
    isEditActive: boolean;
    setParticipantPlayerKills: ( index: number, i: number, j: number, value: number ) => void;
    index: number;
    i: number;
    j: number;
}

export const PlayerCurrentRoundInfo: FC<PlayerCurrentRoundInfoProps> = ( {
    participant, isEditActive, setParticipantPlayerKills, index, i, j,
} ) => {
    const value = participant.dataArray[j]?.[i] ?? 0;

    if ( isEditActive ) {
        return (
            <div className="text">
                <input
                    className="input-text"
                    type="number"
                    value={ value }
                    onChange={ ( e ) => setParticipantPlayerKills( index, i, j, safeNumber( e.target.value ) ) }
                />
            </div>
        );
    }
    return (
        <div className="text">
            <span>{ value }</span>
        </div>
    );
};

interface PlayerCurrentRoundPlacesProps {
    participant: IParticipant;
    isEditActive: boolean;
    setParticipantPlaces: ( index: number, i: number, item: 0 | 1, value: number ) => void;
    index: number;
    i: number;
}

export const PlayerCurrentRoundPlaces: FC<PlayerCurrentRoundPlacesProps> = ( {
    participant, isEditActive, setParticipantPlaces, index, i,
} ) => {
    if ( isEditActive ) {
        return (
            <div className="rating__place">
                <input
                    className="input-text small"
                    type="number"
                    value={ participant.places[i]?.[0] || -1 }
                    onChange={ ( e ) => setParticipantPlaces( index, i, 0, safeNumber( e.target.value, -1 ) ) }
                />
                <input
                    className="input-text small"
                    type="number"
                    value={ participant.places[i]?.[1] || 0 }
                    onChange={ ( e ) => setParticipantPlaces( index, i, 1, safeNumber( e.target.value ) ) }
                />
            </div>
        );
    }
    if ( participant.places[i]?.[0] > 0 ) {
        return <div className="rating__place">{ participant.places[i][0] }</div>;
    }
    return null;
};
