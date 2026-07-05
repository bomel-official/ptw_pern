import { ApiError } from "@error";
import { asyncHandler } from "@shared";
import { CV, generateValidator, isError } from "@core";
import { friendService } from "./friend.service";

export const friendController = {
    getFriends: asyncHandler( async ( req, res ) => {
        const { count, friends } = await friendService.getFriends( req.params.id );
        return res.json( { message: `Друзей найдено: ${ count }`, friends } );
    } ),

    getRequests: asyncHandler( async ( req, res ) => {
        const { count, requests } = await friendService.getRequests( req.params.id );
        return res.json( { message: `Заявок найдено: ${ count }`, requests } );
    } ),

    add: asyncHandler( async ( req, res ) => {
        if ( !req.user?.id ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        const validated = generateValidator( () => ({
            to: new CV( req.body.to, { label: "to" } ).number().val,
        }) );
        if ( isError( validated ) ) {
            throw validated.errorObject;
        }
        const message = await friendService.add( req.user.id, validated.data.to );
        return res.json( { message } );
    } ),

    remove: asyncHandler( async ( req, res ) => {
        if ( !req.user?.id ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        await friendService.remove( req.user.id, req.body.to );
        return res.json( { message: "Пользователь успешно удалён из друзей" } );
    } ),
};
