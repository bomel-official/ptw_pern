import { CV, generateValidator, isError } from "@core";
import { ApiError } from "@error";
import { Request } from "express";

function unwrap<T extends Record<string, unknown>>(
    validated: ReturnType<typeof generateValidator<T>>,
): T {
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }
    return validated.data;
}

export interface RegisterBody {
    teamId: number;
    players: number[];
    tournamentId: number;
    id?: number;
    payMethod: string;
}

export function validateRegisterBody( req: Request ): RegisterBody {
    const data = unwrap( generateValidator( () => ({
        teamId: new CV( req.body.teamId, { label: "teamId" } ).number().val,
        players: new CV( req.body.players, { label: "players" } ).array(
            ( player ) => new CV( player ).number().val ).val,
        tournamentId: new CV( req.body.tournamentId, { label: "tournamentId" } ).number().val,
        id: new CV( req.body.id, { label: "id" } ).optional().number().val,
        payMethod: new CV( req.body.payMethod, { label: "payMethod" } ).string().val,
    }) ) ) as RegisterBody;

    if ( !req.user?.id ) {
        throw ApiError.unauthorized( "Не авторизован" );
    }
    return data;
}

export interface PutManyItem {
    id: number;
    dataArray: number[][];
    places: number[][];
    points: number;
    isRoundsHidden: boolean[];
    players: number;
}

export function validatePutMany( req: Request ): PutManyItem[] {
    return unwrap( generateValidator( () => ({
        participants: new CV( req.body.participants, { label: "participants" } ).array( ( item ) =>
            new CV( item ).object( ( participant ) => ({
                id: new CV( participant.id ).number().val,
                dataArray: new CV( participant.dataArray ).array(
                    ( dataRow ) => new CV( dataRow ).array(
                        ( dataCell ) => new CV( dataCell ).number().val ).val,
                ).val,
                places: new CV( participant.places ).array(
                    ( placesRow ) => new CV( placesRow ).array(
                        ( placesCell ) => new CV( placesCell ).number().val ).val,
                ).val,
                points: new CV( participant.points || 0 ).number().val,
                isRoundsHidden: new CV( participant.isRoundsHidden ).array(
                    ( isRoundHidden ) => new CV( isRoundHidden ).bool().val ).val,
                players: new CV( participant.players ).number().val,
            }) ).val,
        ).val,
    }) ) ).participants as PutManyItem[];
}

export function validateDelete( req: Request ): { participantId?: number; tournamentId?: number } {
    return unwrap( generateValidator( () => ({
        participantId: new CV( req.body.participantId, { label: "participantId" } ).optional().number().val,
        tournamentId: new CV( req.body.tournamentId, { label: "tournamentId" } ).optional().number().val,
    }) ) );
}

export function validateGetMany( req: Request ): { tournamentId: number; type?: string } {
    return unwrap( generateValidator( () => ({
        tournamentId: new CV( req.query.tournamentId, { label: "tournamentId" } ).number().val,
        type: new CV( req.query.type, { label: "type" } ).optional().string().val,
    }) ) );
}

export function validateGetOwn( req: Request ): { tournamentId: number; userId: number } {
    return unwrap( generateValidator( () => ({
        tournamentId: new CV( req.query.tournamentId, { label: "tournamentId" } ).number().val,
        userId: new CV( req.query.userId, { label: "userId" } ).number().val,
    }) ) );
}

