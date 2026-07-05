import { JWTUserData } from "@core";
import { getJwtSecret } from "@libs";
import jwt from "jsonwebtoken";

export function genJwt( { id, email, role, nickname }: JWTUserData ) {
    return jwt.sign(
        { id, email, role, nickname },
        getJwtSecret(),
        { expiresIn: "7d" }
    );
}
