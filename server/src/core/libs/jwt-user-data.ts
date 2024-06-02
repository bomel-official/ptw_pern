import { JWTUserData, User } from "..";

export const jwtUserData = ( user: User ): JWTUserData => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
});
