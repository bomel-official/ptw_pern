import { UserRoleGroup } from "@constants";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";
import { deleteOneBuild } from "./controllers/delete-one-build";
import { deleteOne as deleteOneBuildItem } from "./controllers/delete-one";
import { getManyBuild } from "./controllers/get-many-build";
import { getMany as getManyBuildItem } from "./controllers/get-many";
import { getOneBuildAttachments } from "./controllers/get-one-build-attachments";
import { getOne as getOneBuildItem } from "./controllers/get-one";
import { postOneBuild } from "./controllers/post-one-build";
import { postOne as postOneBuildItem } from "./controllers/post-one";
import { putOneLike as putOneBuildLike } from "./controllers/put-one-like";
import { putOne as putOneBuildItem } from "./controllers/put-one";
import { putToggleBuildMeta } from "./controllers/put-toggle-build-meta";

const buildRouter = Router();

// [GET]
buildRouter.get( "/admin/:object/get-all", getManyBuildItem );
buildRouter.get( "/admin/:object/get-one", getOneBuildItem );
buildRouter.get( "/search", getManyBuild );
buildRouter.get( "/attachment/get-all-included", getOneBuildAttachments );

// [POST]
buildRouter.post( "/admin/:object/create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), postOneBuildItem );
buildRouter.post( "/create", authMiddleware, postOneBuild );

// [PUT] (POST kept to match the current client contract)
buildRouter.post( "/admin/:object/edit",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), putOneBuildItem );
buildRouter.post( "/toggle-meta",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), putToggleBuildMeta );
buildRouter.post( "/like", authMiddleware, putOneBuildLike );

// [DELETE] (POST kept to match the current client contract)
buildRouter.post( "/admin/:object/delete",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), deleteOneBuildItem );
buildRouter.post( "/delete", authMiddleware, deleteOneBuild );

export { buildRouter };
