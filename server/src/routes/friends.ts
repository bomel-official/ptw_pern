import { deleteOneFriendRequest, getManyFriend, getManyFriendRequest, postOneFriendRequest } from "@controllers";
import { authMiddleware } from "@middleware";
import { Router } from "express";

const friendsRouter = Router();

// [GET]

friendsRouter.get( "/friends/:id", getManyFriend );
friendsRouter.get( "/friend-requests/:id", getManyFriendRequest );

// [POST]

friendsRouter.post( "/add-friend/", authMiddleware, postOneFriendRequest );

// [DELETE]

friendsRouter.post( "/remove-friend/", authMiddleware, deleteOneFriendRequest );

export { friendsRouter };
