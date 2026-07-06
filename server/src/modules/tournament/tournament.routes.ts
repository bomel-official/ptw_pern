import { UserRoleGroup } from "@constants";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { participantController } from "@modules/participant";
import { participantRequestController } from "@modules/participant-request";
import { Router } from "express";
import { tournamentController } from "./tournament.controller";

const tournamentRouter = Router();

// NOTE: verbs kept as POST for the mutating routes to preserve the current
// client contract. Correcting them to PUT/DELETE is deferred to the client
// RTK Query migration of this domain.

// [GET]
tournamentRouter.get( "/get-all", tournamentController.getMany );
tournamentRouter.get( "/get-participants", participantController.getMany );
tournamentRouter.get( "/get-own-participant", participantController.getOwn );
tournamentRouter.get( "/:slug", tournamentController.getOne );

// [POST]
tournamentRouter.post( "/create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), tournamentController.create );
tournamentRouter.post( "/register", authMiddleware, participantController.register );
tournamentRouter.post( "/create-participant-request", authMiddleware,
    participantRequestController.create );

// [PUT] (POST for now — see note)
tournamentRouter.post( "/edit",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), tournamentController.update );
tournamentRouter.post( "/redeclare-room",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), participantController.redeclareRoomNumber );
tournamentRouter.post( "/change-participant-request-status",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), participantRequestController.updateStatus );
tournamentRouter.post( "/edit-register",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), participantController.putMany );
tournamentRouter.post( "/change-pay-status",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), participantController.togglePayStatus );
tournamentRouter.post( "/increase-priority",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), participantController.increasePriority );

// [DELETE] (POST for now — see note)
tournamentRouter.post( "/unregister", authMiddleware, participantController.remove );

export { tournamentRouter };
