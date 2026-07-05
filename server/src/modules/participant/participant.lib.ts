import { AMOUNT_ROUNDS } from "@constants";
import { ParticipantRepository } from "@core";

export interface ParticipantPointsInput {
    places: number[][];
    isRoundsHidden: boolean[];
    dataArray: number[][];
    players: number;
}

/**
 * Total points for a participant = per-round placement points + kill points of
 * every player, skipping rounds flagged hidden. Pure — the money/ranking core.
 */
export function computeParticipantPoints( item: ParticipantPointsInput ): number {
    let points = 0;
    for ( let i = 0; i < AMOUNT_ROUNDS; i++ ) {
        points += item.places[i][1];
        if ( !(item.isRoundsHidden.length && item.isRoundsHidden[i]) ) {
            for ( let j = 0; j < item.players; j++ ) {
                points += item.dataArray[j][i];
            }
        }
    }
    return points;
}

/** Finds the lowest unused room number (1-based) for a tournament. */
export async function getParticipantRoomNumber( tournamentId: number ): Promise<number> {
    const participants = await ParticipantRepository.findAll( {
        where: { tournamentId },
        attributes: [ "roomNumber", "id" ],
        order: [ [ "roomNumber", "ASC" ], [ "id", "ASC" ] ],
    } );
    let roomNumber = 1;
    for ( const currentParticipant of participants ) {
        if ( currentParticipant.roomNumber === roomNumber ) {
            roomNumber += 1;
        }
    }
    return roomNumber;
}
