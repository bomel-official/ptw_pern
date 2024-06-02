import { deleteOneTeam, getManyTeam, postPutOneTeam } from "@controllers";
import { authMiddleware } from "@middleware";
import { Router } from "express";

const teamRouter = Router();

// [GET]

teamRouter.get( "/search", getManyTeam );

// [POST]

teamRouter.post( "/save-create", authMiddleware, postPutOneTeam );

// [DELETE]

teamRouter.post( "/delete-leave", authMiddleware,
    deleteOneTeam );

export { teamRouter };
