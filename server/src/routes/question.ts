import { UserRoleGroup } from "@constants";
import {
    deleteOneQuestion,
    getManyQuestion,
    postPutOneQuestion
} from "@controllers";
import { createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";

const questionRouter = Router();

// [GET]

questionRouter.get( "/get", getManyQuestion );

// [POST]

questionRouter.post( "/save-create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    postPutOneQuestion );

// [DELETE]
questionRouter.post( "/delete",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    deleteOneQuestion );

export { questionRouter };
