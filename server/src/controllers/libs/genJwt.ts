import { JWTUserData } from "@core";
import { getEnv } from "@libs";
import jwt from "jsonwebtoken";

export function genJwt( { id, email, role, nickname }: JWTUserData ) {
    return jwt.sign(
        { id, email, role, nickname },
        getEnv( process.env.JWT_SECRET_KEY ),
        { expiresIn: "7d" }
    );
}
