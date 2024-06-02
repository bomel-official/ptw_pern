import { CV } from "@core";
import { ApiError } from "@error";
import { Request } from "express";
import { uploadImage } from "../libs";

export async function postOneValidate( req: Request ) {
    try {
        const { participantId, dataArray, places } = {
            participantId: new CV( req.body.participantId ).number().val,
            dataArray: new CV( req.body.dataArray ).array(
                ( dataRow ) => new CV( dataRow ).array(
                    ( dataCell ) => new CV( dataCell ).number().val ).val
            ).val,
            places: new CV( req.body.places ).array(
                ( placesRow ) => new CV( placesRow ).array(
                    ( placesCell ) => new CV(
                        placesCell ).number().val ).val
            ).val,
        };

        const { approve } = req.files || { approve: null };
        if ( !approve ) {
            return ApiError.badRequest( "Нет подтверждающего изображения" );
        }

        const reqUser = req.user;
        if ( !reqUser ) {
            return ApiError.unauthorized( "Не авторизован" );
        }

        const filename = await uploadImage( approve,
            { width: 1280, height: 720, fit: "contain" } );
        if ( !filename ) {
            return ApiError.badRequest( "Нет подтверждающего изображения" );
        }

        return { participantId, dataArray, places, reqUser, filename } as const;
    } catch ( e ) {
        return e as ApiError;
    }
}
