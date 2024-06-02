import { JWTUserData } from "@core";

declare global {
    namespace Express {
        export interface Request {
            user?: JWTUserData,
        }
    }
}
