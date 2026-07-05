import { asyncHandler } from "@shared";
import { participantRequestService } from "./participant-request.service";
import { validateParticipantRequest } from "./participant-request.validation";

export const participantRequestController = {
    create: asyncHandler( async ( req, res ) => {
        const data = await validateParticipantRequest( req );
        const participantRequest = await participantRequestService.create( data );
        return res.json( { participantRequest } );
    } ),

    updateStatus: asyncHandler( async ( req, res ) => {
        const { participantRequestId, status } = req.body;
        const isOk = await participantRequestService.updateStatus( participantRequestId, status );
        return res.json( { isOk } );
    } ),
};
