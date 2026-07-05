import { UserRoleGroup } from "@constants";
import { createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";
import { questionController } from "./question.controller";

const questionRouter = Router();

questionRouter.get( "/get", questionController.getMany );

questionRouter.post(
    "/save-create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    questionController.saveCreate,
);

questionRouter.delete(
    "/delete",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    questionController.remove,
);

export { questionRouter };
