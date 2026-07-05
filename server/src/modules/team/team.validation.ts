import { CV, generateValidator, isError, JWTUserData } from "@core";
import { ApiError } from "@error";
import { Request } from "express";
import { uploadImage } from "../../controllers/libs";

export interface SaveTeamDto {
    players: number[];
    name: string;
    id?: number;
    capitanId: number;
    filename: string | undefined;
    reqUser: JWTUserData;
}

export async function validateSaveTeam( req: Request ): Promise<SaveTeamDto> {
    const avatar = req.files?.avatar ?? null;
    const filename = await uploadImage( avatar, { width: 120, height: 120 } );

    if ( !req.user?.id ) {
        throw ApiError.unauthorized( "Не авторизован" );
    }
    const reqUser = req.user;

    const validated = generateValidator( () => ({
        players: new CV( req.body.players, { label: "players" } ).array(
            ( val ) => new CV( val ).number().val ).val,
        name: new CV( req.body.name, { label: "name" } ).string().val,
        id: new CV( req.body.id, { label: "id" } ).optional().number().val,
        capitanId: new CV( req.body.capitanId, { label: "capitanId" } ).optional().number().val
            ?? reqUser.id,
    }) );
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }

    return { ...validated.data, filename, reqUser } as SaveTeamDto;
}

export interface TeamSearchQuery {
    type?: string;
    userId?: number;
    s?: string;
}

export function validateTeamSearch( req: Request ): TeamSearchQuery {
    const validated = generateValidator( () => ({
        type: new CV( req.query.type, { label: "type" } ).optional().string().val,
        userId: new CV( req.query.userId, { label: "userId" } ).optional().number().val,
        s: new CV( req.query.s, { label: "s" } ).optional().string().val,
    }) );
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }
    return validated.data;
}
