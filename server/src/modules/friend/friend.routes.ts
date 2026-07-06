import { authMiddleware } from "@middleware";
import { Router } from "express";
import { friendController } from "./friend.controller";

const friendsRouter = Router();

friendsRouter.get( "/friends/:id", friendController.getFriends );
friendsRouter.get( "/friend-requests/:id", friendController.getRequests );
friendsRouter.post( "/add-friend/", authMiddleware, friendController.add );
// POST kept to match the current client contract (logical DELETE)
friendsRouter.post( "/remove-friend/", authMiddleware, friendController.remove );

export { friendsRouter };
