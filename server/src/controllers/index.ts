// Auth
export { redirectDiscordProceed } from "./auth/redirect-discord-proceed";
export { redirectDiscord } from "./auth/redirect-discord";
export { getUserByCookie } from "./auth/get-user-by-cookie";
export { renew } from "./auth/renew";
export { login } from "./auth/login";
export { check } from "./auth/check";

// Build
export { deleteOne as deleteOneBuildItem } from "./build/delete-one";
export { deleteOneBuild } from "./build/delete-one-build";
export { getMany as getManyBuildItem } from "./build/get-many";
export { getManyBuild } from "./build/get-many-build";
export { getOne as getOneBuildItem } from "./build/get-one";
export { getOneBuildAttachments } from "./build/get-one-build-attachments";
export { postOne as postOneBuildItem } from "./build/post-one";
export { postOneBuild } from "./build/post-one-build";
export { putOneLike as putOneBuildLike } from "./build/put-one-like";
export { putOne as putOneBuildItem } from "./build/put-one";
export { putToggleBuildMeta } from "./build/put-toggle-build-meta";

// Payment — migrated to modules/payment (Phase 4)

// Friend request
export { getManyFriend } from "./friend-request/get-many-friend";
export { getMany as getManyFriendRequest } from "./friend-request/get-many";
export { postOne as postOneFriendRequest } from "./friend-request/post-one";
export {
    deleteOne as deleteOneFriendRequest
} from "./friend-request/delete-one";

// Question — migrated to modules/question (Phase 2)

// Team
export { getMany as getManyTeam } from "./team/get-many";
export { postPutOne as postPutOneTeam } from "./team/post-put-one";
export { deleteOne as deleteOneTeam } from "./team/delete-one";

// Participant — migrated to modules/participant (Phase 4)

// Participant request — migrated to modules/participant-request (Phase 4)

// Tournament — migrated to modules/tournament (Phase 4)

// User
export { getMany as getManyUser } from "./user/get-many";
export { getManyAdmins as getManyUserAdmins } from "./user/get-many-admins";
export { getOne as getOneUser } from "./user/get-one";
export {
    getOneByNickname as getOneUserByNickname
} from "./user/get-one-by-nickname";
export { postOne as postOneUser } from "./user/post-one";
export { putOne as putOneUser } from "./user/put-one";
export { putOneRole as putOneUserRole } from "./user/put-one-role";

// Competition — migrated to modules/competition (Phase 5)
