import { ApiError } from "@error";
import { asyncHandler } from "@shared";
import { participantService } from "./participant.service";
import {
    validateDelete,
    validateGetMany,
    validateGetOwn,
    validatePutMany,
    validateRegisterBody,
} from "./participant.validation";

const REGISTERED_MESSAGE = "Вы зарегистрировалиь на турнир!";

export const participantController = {
    register: asyncHandler( async ( req, res ) => {
        const body = validateRegisterBody( req );
        const { url } = await participantService.register( body, req.user!.id );
        if ( url ) {
            return res.json( { isOk: true, message: REGISTERED_MESSAGE, url } );
        }
        return res.json( { isOk: true, message: REGISTERED_MESSAGE } );
    } ),

    getMany: asyncHandler( async ( req, res ) => {
        const { tournamentId, type } = validateGetMany( req );
        const participants = await participantService.getMany( tournamentId, type );
        return res.json( { participants } );
    } ),

    getOwn: asyncHandler( async ( req, res ) => {
        const { tournamentId, userId } = validateGetOwn( req );
        const result = await participantService.getOwn( tournamentId, userId );
        return res.json( result );
    } ),

    putMany: asyncHandler( async ( req, res ) => {
        const participants = validatePutMany( req );
        await participantService.putMany( participants );
        return res.json( { isOk: true, message: "Данные обновлены!" } );
    } ),

    remove: asyncHandler( async ( req, res ) => {
        if ( !req.user?.id ) {
            throw ApiError.unauthorized( "Не авторизован" );
        }
        const params = validateDelete( req );
        await participantService.remove( params, req.user );
        return res.json( { isOk: true, message: "Удалено!" } );
    } ),

    increasePriority: asyncHandler( async ( req, res ) => {
        await participantService.increasePriority( req.body.participantId );
        return res.json( { isOk: true, message: "Данные обновлены!" } );
    } ),

    togglePayStatus: asyncHandler( async ( req, res ) => {
        await participantService.togglePayStatus( req.body.participantId );
        return res.json( { message: "Статус оплаты изменён!", isOk: true } );
    } ),

    redeclareRoomNumber: asyncHandler( async ( req, res ) => {
        await participantService.redeclareRoomNumber( req.body.participantId );
        return res.json( { isOk: true } );
    } ),
};
