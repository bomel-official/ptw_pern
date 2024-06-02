import { UserRoleGroup } from "@constants";
import {
    deleteOneParticipant,
    getManyParticipant,
    getManyTournament,
    getOneOwnParticipant,
    getOneParticipantPayStatus,
    getOneParticipantPayUrl,
    getOneTournament,
    postOneParticipant,
    postOneParticipantRequest,
    postOneTournament,
    putManyParticipant,
    putOneParticipantIncreasePriority,
    putOneParticipantPayStatus,
    putOneParticipantRequestStatus,
    putOneParticipantRoomNumber,
    putOneTournament
} from "@controllers";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";

const tournamentRouter = Router();

// [GET]

tournamentRouter.get( "/get-all", getManyTournament );
tournamentRouter.get( "/get-participants", getManyParticipant );
tournamentRouter.get( "/get-own-participant", getOneOwnParticipant );
tournamentRouter.get( "/get-pay-url", getOneParticipantPayUrl );
tournamentRouter.get( "/get-pay-info", getOneParticipantPayStatus );
tournamentRouter.get( "/:slug", getOneTournament );

// [POST]

tournamentRouter.post( "/create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), postOneTournament );
tournamentRouter.post( "/register", authMiddleware, postOneParticipant );
tournamentRouter.post( "/create-participant-request", authMiddleware,
    postOneParticipantRequest );

// [PUT]

tournamentRouter.post( "/edit",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), putOneTournament );
tournamentRouter.post( "/redeclare-room",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    putOneParticipantRoomNumber );
tournamentRouter.post( "/change-participant-request-status",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    putOneParticipantRequestStatus );
tournamentRouter.post( "/edit-register",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), putManyParticipant );
tournamentRouter.post( "/change-pay-status",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    putOneParticipantPayStatus );
tournamentRouter.post( "/increase-priority",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    putOneParticipantIncreasePriority );

// [DELETE]

tournamentRouter.post( "/unregister", authMiddleware, deleteOneParticipant );

export { tournamentRouter };
