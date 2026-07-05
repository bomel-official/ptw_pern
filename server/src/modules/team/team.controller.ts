import { asyncHandler } from "@shared";
import { teamService } from "./team.service";
import { validateSaveTeam, validateTeamSearch } from "./team.validation";

export const teamController = {
    search: asyncHandler( async ( req, res ) => {
        const rows = await teamService.search( validateTeamSearch( req ) );
        return res.json( { rows } );
    } ),

    save: asyncHandler( async ( req, res ) => {
        const dto = await validateSaveTeam( req );
        const { team, created } = await teamService.save( dto );
        return res.json( { message: created ? "Команда создана" : "Команда обновлена", team } );
    } ),

    deleteOrLeave: asyncHandler( async ( req, res ) => {
        const { teamId, userId } = req.body;
        const { message } = await teamService.deleteOrLeave( teamId, userId );
        return res.json( { message, isOk: true } );
    } ),
};
