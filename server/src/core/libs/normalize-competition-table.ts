import { CompetitionNormalized, CompetitionTable, CompetitionTableNormalized, Team, User } from "@core";

export function normalizeCompetitionTable( competitionTable: CompetitionTable | null ): CompetitionTableNormalized | null {
    if ( !competitionTable ) {
        return null;
    }

    const participantsUsers: CompetitionNormalized["competitionTable"]["participantsUsers"] = competitionTable.participants.map(
        participantRow => participantRow.map( participantItem => {
            const participantItemItems: (User | Team)[] = [];
            for ( const itemId of participantItem.items ) {
                if ( competitionTable.type === "user" ) {
                    const foundUser = competitionTable.users.find( ( user ) => user.id === itemId ) ?? null;
                    if ( foundUser ) {
                        participantItemItems.push( foundUser );
                    }
                }
                if ( competitionTable.type === "team" ) {
                    const foundTeam = competitionTable.teams.find( ( team ) => team.id === itemId ) ?? null;
                    if ( foundTeam ) {
                        participantItemItems.push( foundTeam );
                    }
                }
            }
            return ({
                ...participantItem, items: participantItemItems
            });
        } ) );

    const outsidersUsers: CompetitionNormalized["competitionTable"]["outsidersUsers"] = competitionTable.outsiders.map(
        outsiderRow => outsiderRow.map( outsiderItem => {
            const outsiderItemItems: (User | Team)[] = [];
            for ( const itemId of outsiderItem.items ) {
                if ( competitionTable.type === "user" ) {
                    const foundUser = competitionTable.users.find( ( user ) => user.id === itemId ) ?? null;
                    if ( foundUser ) {
                        outsiderItemItems.push( foundUser );
                    }
                }
                if ( competitionTable.type === "team" ) {
                    const foundTeam = competitionTable.teams.find( ( team ) => team.id === itemId ) ?? null;
                    if ( foundTeam ) {
                        outsiderItemItems.push( foundTeam );
                    }
                }
            }
            return ({
                ...outsiderItem, items: outsiderItemItems
            });
        } ) );

    return {
        id: competitionTable.id,
        type: competitionTable.type,
        parentType: competitionTable.parentType,
        allowShuffle: competitionTable.allowShuffle,
        itemsInTeam: competitionTable.itemsInTeam,
        isOutsiders: competitionTable.isOutsiders,
        competitionId: competitionTable.competitionId,
        tournamentId: competitionTable.tournamentId,
        users: competitionTable.users,
        teams: competitionTable.teams,
        participantsUsers,
        outsidersUsers,
        createdAt: competitionTable.createdAt,
        updatedAt: competitionTable.updatedAt,
    };
}
