import { CV, generateValidator, isError } from "@core";
import { ApiError } from "@error";
import { Request } from "express";
import { uploadImage } from "../../controllers/libs";

export interface ParticipantRequestData {
    participantId: number;
    dataArray: number[][];
    places: number[][];
    filename: string;
    reqUserId: number;
}

/** Validates a participant-request submission (multipart with an approve image). */
export async function validateParticipantRequest( req: Request ): Promise<ParticipantRequestData> {
    const validated = generateValidator( () => ({
        participantId: new CV( req.body.participantId ).number().val,
        dataArray: new CV( req.body.dataArray ).array(
            ( dataRow ) => new CV( dataRow ).array(
                ( dataCell ) => new CV( dataCell ).number().val ).val,
        ).val,
        places: new CV( req.body.places ).array(
            ( placesRow ) => new CV( placesRow ).array(
                ( placesCell ) => new CV( placesCell ).number().val ).val,
        ).val,
    }) );
    if ( isError( validated ) ) {
        throw validated.errorObject;
    }
    const { participantId, dataArray, places } = validated.data;

    if ( !req.user?.id ) {
        throw ApiError.unauthorized( "Не авторизован" );
    }

    const approve = req.files?.approve ?? null;
    if ( !approve ) {
        throw ApiError.badRequest( "Нет подтверждающего изображения" );
    }
    const filename = await uploadImage( approve, { width: 1280, height: 720, fit: "contain" } );
    if ( !filename ) {
        throw ApiError.badRequest( "Нет подтверждающего изображения" );
    }

    return { participantId, dataArray, places, filename, reqUserId: req.user.id };
}
