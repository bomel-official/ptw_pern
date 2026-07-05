import { CompetitionParticipant } from "@core";

export const EMPTY_NUMBER_VALUE = -1;

/**
 * Flatten the participant matrix into a deduped list of member ids, skipping
 * empty slots (index === EMPTY_NUMBER_VALUE). Shared by the create and edit
 * paths (previously duplicated verbatim in the fat controller).
 */
export function collectMemberIds( participants: CompetitionParticipant<number>[][] ): number[] {
    const ids: number[] = [];
    for ( const row of participants ) {
        for ( const item of row ) {
            if ( item.index === EMPTY_NUMBER_VALUE ) {
                continue;
            }
            for ( const memberId of item.items ) {
                if ( !ids.includes( memberId ) ) {
                    ids.push( memberId );
                }
            }
        }
    }
    return ids;
}
