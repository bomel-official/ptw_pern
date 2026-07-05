import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { UserRole } from "../src/core/constants";
import { getJwtSecret } from "../src/core/libs/get-env";
import { genJwt } from "../src/controllers/libs/genJwt";

describe( "genJwt", () => {
    const payload = {
        id: 42,
        email: "user@example.com",
        role: UserRole.USER,
        nickname: "tester",
    };

    it( "signs a token that verifies with the same secret and preserves claims", () => {
        const token = genJwt( payload );
        const decoded = jwt.verify( token, getJwtSecret() ) as typeof payload;

        expect( decoded.id ).toBe( payload.id );
        expect( decoded.email ).toBe( payload.email );
        expect( decoded.role ).toBe( payload.role );
        expect( decoded.nickname ).toBe( payload.nickname );
    } );

    it( "produces a token that fails verification with a wrong secret", () => {
        const token = genJwt( payload );
        expect( () => jwt.verify( token, "wrong-secret" ) ).toThrow();
    } );
} );
