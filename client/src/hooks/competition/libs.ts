import { CompetitionParticipant, IUser, Team } from "../../StoreTypes";
import { COMPETITION_ITEM_DEFAULT } from "./constants";

export function shuffleArray<TItem extends any>( competitionRow: TItem[] ): TItem[] {
    const row = [ ...competitionRow ];
    let currentIndex = row.length;

    while ( currentIndex !== 0 ) {
        let randomIndex = Math.floor( Math.random() * currentIndex );
        currentIndex--;
        [ row[currentIndex], row[randomIndex] ] = [
            row[randomIndex], row[currentIndex] ];
    }
    return row;
}

export function generateTeams(
    items: (Team | IUser)[],
    itemsInTeam: number,
    amountLength: number,
    shuffleTeamMembers: boolean
): { participantsUsersRow: Array<CompetitionParticipant<Team | IUser>> } {
    const newItems = shuffleTeamMembers ? shuffleArray( items ) : items;

    const participantsUsersRow: Array<CompetitionParticipant<Team | IUser>> = Array( amountLength )
        .fill( COMPETITION_ITEM_DEFAULT );

    let i = 0;
    let participantIndex = 0;
    while ( i < newItems.length ) {
        const newItemCapitan = newItems[i];
        const itemIndex = items.findIndex( ( item ) => newItemCapitan.id === item.id );
        const newItemUsers = {
            index: itemIndex,
            items: [ newItemCapitan ],
            points: 0
        };
        for ( let j = 1; j < itemsInTeam; j++ ) {
            i++;
            newItemUsers.items.push( newItems[i] );
        }
        participantsUsersRow[participantIndex] = newItemUsers;
        participantIndex++;
        i++;
    }

    return {
        participantsUsersRow: shuffleArray( participantsUsersRow )
    };
}
