import { asyncHandler, sendSuccess } from "@shared";
import { competitionService } from "./competition.service";
import {
    validateId,
    validateListType,
    validateUpsertCompetition,
    validateUpsertCompetitionTable,
} from "./competition.validation";

export const competitionController = {
    getOne: asyncHandler( async ( req, res ) => {
        const id = validateId( req.query.id );
        return sendSuccess( res, await competitionService.getOne( id ) );
    } ),

    getMany: asyncHandler( async ( req, res ) => {
        const type = validateListType( req.query.type );
        return sendSuccess( res, await competitionService.getMany( type, req.user ) );
    } ),

    upsert: asyncHandler( async ( req, res ) => {
        const dto = validateUpsertCompetition( req.body );
        return sendSuccess( res, await competitionService.upsertCompetition( dto, req.user ) );
    } ),

    upsertTable: asyncHandler( async ( req, res ) => {
        const dto = validateUpsertCompetitionTable( req.body );
        return sendSuccess( res, await competitionService.upsertTable( dto, req.user ) );
    } ),
};
