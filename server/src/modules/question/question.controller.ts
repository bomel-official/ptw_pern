import { ApiError } from "@error";
import { asyncHandler, sendSuccess } from "@shared";
import { questionService } from "./question.service";
import { validateUpsertQuestion } from "./question.validation";

export const questionController = {
    getMany: asyncHandler( async ( req, res ) => {
        const rows = await questionService.getAll();
        return sendSuccess( res, rows );
    } ),

    saveCreate: asyncHandler( async ( req, res ) => {
        const dto = validateUpsertQuestion( req.body );
        const { item, created } = await questionService.upsert( dto );
        return sendSuccess(
            res,
            item,
            created ? "Вопрос добавлен!" : "Вопрос обновлён!",
            created ? 201 : 200,
        );
    } ),

    remove: asyncHandler( async ( req, res ) => {
        const id = Number( req.body?.id );
        if ( !id ) {
            throw ApiError.badRequest( "Не указан id" );
        }
        await questionService.remove( id );
        return sendSuccess( res, { id }, "Вопрос удалён!" );
    } ),
};
