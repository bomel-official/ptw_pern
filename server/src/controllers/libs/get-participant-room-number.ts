import { Participant } from "@core";

export async function getParticipantRoomNumber( tournamentId: number ) {
    const participants = await Participant.findAll( {
        where: {
            tournamentId: tournamentId
        },
        attributes: [ "roomNumber", "id" ],
        order: [
            [ "roomNumber", "ASC" ],
            [ "id", "ASC" ],
        ],
    } );
    let roomNumber: number = 1;
    for ( const currentParticipant of participants ) {
        if ( currentParticipant.roomNumber === roomNumber ) {
            roomNumber += 1;
        }
    }
    return roomNumber;
}
