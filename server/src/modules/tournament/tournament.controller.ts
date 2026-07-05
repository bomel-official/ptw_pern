import { asyncHandler } from "@shared";
import { tournamentService } from "./tournament.service";
import { parseUpdateTournament, validateCreateTournament } from "./tournament.validation";

export const tournamentController = {
    getMany: asyncHandler( async ( req, res ) => {
        const tournaments = await tournamentService.getMany( req.query );
        return res.json( { tournaments } );
    } ),

    getOne: asyncHandler( async ( req, res ) => {
        const tournament = await tournamentService.getOneBySlug( req.params.slug );
        return res.json( { tournament } );
    } ),

    create: asyncHandler( async ( req, res ) => {
        const dto = await validateCreateTournament( req );
        const item = await tournamentService.create( dto );
        return res.json( { message: "Турнир создан!", item } );
    } ),

    update: asyncHandler( async ( req, res ) => {
        const { id, slug, filename, body } = await parseUpdateTournament( req );
        await tournamentService.update( id, slug, filename, body );
        return res.json( { message: "Турнир обновлён!" } );
    } ),
};
