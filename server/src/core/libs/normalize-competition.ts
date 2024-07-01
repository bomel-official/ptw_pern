import { Competition, CompetitionNormalized } from "@core";

export function normalizeCompetition( competition: Competition | null ): CompetitionNormalized | null {
    if ( !competition ) return null;

    const normalizedParticipants = competition.participants.map(
        participantRow => participantRow.filter( ( participantItem ) => participantItem !== -2 ) );

    const normalizedOutsiders = competition.outsiders.map(
        outsiderRow => outsiderRow.filter( ( outsiderItem ) => outsiderItem !== -2 ) );

    const participantsUsers = normalizedParticipants.map( participantRow => participantRow.map(
        participantItem => participantItem === -1 ? null :
            competition.users.find( user => user.id === participantItem ) ?? null ) );

    const outsidersUsers = normalizedOutsiders.map( outsiderRow => outsiderRow.map(
        outsiderItem => outsiderItem === -1 ? null :
            competition.users.find( user => user.id === outsiderItem ) ?? null ) );

    return {
        id: competition.id,
        title: competition.title,
        participantsAmount: competition.participantsAmount,
        isOutsiders: competition.isOutsiders,
        participants: normalizedParticipants,
        outsiders: normalizedOutsiders,
        updatedAt: competition.updatedAt,
        createdAt: competition.createdAt,
        authorId: competition.authorId,
        participantsUsers,
        outsidersUsers,
    };
}
