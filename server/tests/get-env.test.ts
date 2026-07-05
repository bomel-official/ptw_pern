import { afterEach, describe, expect, it } from "vitest";
import { getEnv, getJwtSecret, requireEnv } from "../src/core/libs/get-env";

describe( "getEnv", () => {
    it( "returns the value when set", () => {
        expect( getEnv( "value" ) ).toBe( "value" );
    } );

    it( "returns an empty string when undefined", () => {
        expect( getEnv( undefined ) ).toBe( "" );
    } );
} );

describe( "requireEnv", () => {
    const key = "PTW_TEST_REQUIRE_ENV";
    afterEach( () => {
        delete process.env[key];
    } );

    it( "returns the value when set", () => {
        process.env[key] = "present";
        expect( requireEnv( key ) ).toBe( "present" );
    } );

    it( "throws when missing", () => {
        expect( () => requireEnv( key ) ).toThrow( /Missing required environment variable/ );
    } );

    it( "throws when empty string", () => {
        process.env[key] = "";
        expect( () => requireEnv( key ) ).toThrow();
    } );
} );

describe( "getJwtSecret", () => {
    it( "returns the configured secret", () => {
        // setup.ts guarantees JWT_SECRET_KEY is defined
        expect( getJwtSecret() ).toBeTruthy();
    } );
} );
