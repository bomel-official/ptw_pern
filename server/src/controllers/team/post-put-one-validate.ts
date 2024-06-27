import { CV } from "@core";
import { ApiError } from "@error";
import { Request } from "express";
import { uploadImage } from "../libs";

export async function postPutOneValidate( req: Request ) {
    try {
        const { avatar } = req.files || { avatar: null };
        const filename = await uploadImage( avatar,
            { width: 120, height: 120 } );

        if ( !req.user || !req.user.id ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }

        const data = {
            players: new CV( req.body.players, { label: "players" } ).array(
                ( val ) => new CV( val ).number().val ).val,
            name: new CV( req.body.name, { label: "name" } ).string().val,
            id: new CV( req.body.id, { label: "id" } ).optional().number().val,
            capitanId: new CV( req.body.capitanId,
                { label: "capitanId" } ).optional().number().val ?? req.user.id,
            filename,
            reqUser: req.user
        };
        return {
            error: false,
            data,
            errorObject: null
        };
    } catch ( e ) {
        return {
            error: true,
            errorObject: e as ApiError,
            data: null
        };
    }
}
