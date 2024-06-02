import { UserRoleGroup } from "@constants";
import {
    deleteOneBuild,
    deleteOneBuildItem,
    getManyBuild,
    getManyBuildItem,
    getOneBuildAttachments,
    getOneBuildItem,
    postOneBuild,
    postOneBuildItem,
    putOneBuildItem,
    putOneBuildLike,
    putToggleBuildMeta
} from "@controllers";
import { authMiddleware, createCheckRoleMiddleware } from "@middleware";
import { Router } from "express";

const buildRouter = Router();

// [GET]

buildRouter.get( "/admin/:object/get-all", getManyBuildItem );
buildRouter.get( "/admin/:object/get-one", getOneBuildItem );
buildRouter.get( "/search", getManyBuild );
buildRouter.get( "/attachment/get-all-included",
    getOneBuildAttachments );

// [POST]

buildRouter.post( "/admin/:object/create",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), postOneBuildItem );
buildRouter.post( "/create", authMiddleware, postOneBuild );

// [PUT]

buildRouter.post( "/admin/:object/edit",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), putOneBuildItem );
buildRouter.post( "/toggle-meta",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ),
    putToggleBuildMeta );
buildRouter.post( "/like", authMiddleware, putOneBuildLike );

// [DELETE]

buildRouter.post( "/admin/:object/delete",
    createCheckRoleMiddleware( UserRoleGroup.ADMIN ), deleteOneBuildItem );
buildRouter.post( "/delete", authMiddleware, deleteOneBuild );

export { buildRouter };
