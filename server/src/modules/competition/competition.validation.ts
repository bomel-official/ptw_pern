import { CV, generateValidator, isError } from "@core";
import { UpsertCompetitionDto, UpsertCompetitionTableDto } from "./competition.dto";

function unwrap<T extends Record<string, unknown>>(
    validated: ReturnType<typeof generateValidator<T>>,
): T {
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }
    return validated.data;
}

export function validateId( raw: unknown ): number {
    return unwrap( generateValidator( () => ({
        id: new CV( raw, { label: "id" } ).number().val,
    }) ) ).id;
}

export function validateListType( raw: unknown ): string {
    return unwrap( generateValidator( () => ({
        type: new CV( raw, { label: "type" } ).optional().string().val,
    }) ) ).type ?? "all";
}

export function validateUpsertCompetition( body: unknown ): UpsertCompetitionDto {
    const src = body as Record<string, unknown>;
    return unwrap( generateValidator( () => ({
        id: new CV( src.id, { label: "id" } ).optional().number().val,
        title: new CV( src.title, { label: "title" } ).string().val,
        participantsAmount: new CV( src.participantsAmount,
            { label: "participantsAmount" } ).number().val,
    }) ) ) as UpsertCompetitionDto;
}

const participantMatrix = ( value: unknown, label: string ) =>
    new CV( value, { label } ).array(
        ( row ) => new CV( row ).array(
            ( item ) => new CV( item ).object( ( obj ) => ({
                index: new CV( obj.index ).number().val,
                points: new CV( obj.points ).number().val,
                items: new CV( obj.items ).array(
                    ( id ) => new CV( id ).number().val,
                ).val,
            }) ).val,
        ).val,
    ).val;

export function validateUpsertCompetitionTable( body: unknown ): UpsertCompetitionTableDto {
    const src = body as Record<string, unknown>;
    return unwrap( generateValidator( () => ({
        id: new CV( src.id, { label: "id" } ).optional().number().val,
        competitionId: new CV( src.competitionId, { label: "competitionId" } ).optional().number().val,
        tournamentId: new CV( src.tournamentId, { label: "tournamentId" } ).optional().number().val,
        allowShuffle: new CV( src.allowShuffle, { label: "allowShuffle" } ).bool().val,
        isOutsiders: new CV( src.isOutsiders, { label: "isOutsiders" } ).bool().val,
        type: new CV( src.type, { label: "type" } ).string().included( [ "user", "team" ] as const ).val,
        itemsInTeam: new CV( src.itemsInTeam, { label: "itemsInTeam" } ).number().val,
        parentType: new CV( src.parentType, { label: "parentType" } ).string().included(
            [ "tournament", "competition" ] as const ).val,
        participants: participantMatrix( src.participants, "participants" ),
        outsiders: participantMatrix( src.outsiders, "outsiders" ),
    }) ) ) as UpsertCompetitionTableDto;
}
