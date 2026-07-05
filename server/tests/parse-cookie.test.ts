import { describe, expect, it } from "vitest";
import { parseCookie } from "../src/controllers/libs/parse-cookie";

describe( "parseCookie", () => {
    it( "returns empty object for undefined input", () => {
        expect( parseCookie( undefined ) ).toEqual( {} );
    } );

    it( "parses a single cookie", () => {
        expect( parseCookie( "token=abc" ) ).toEqual( { token: "abc" } );
    } );

    it( "parses multiple cookies and trims whitespace", () => {
        expect( parseCookie( "a=1; b=2" ) ).toEqual( { a: "1", b: "2" } );
    } );

    it( "keeps '=' characters inside the value (JWTs / base64)", () => {
        const jwt =
            "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0=.sig==";
        expect( parseCookie( `token=${ jwt }` ) ).toEqual( { token: jwt } );
    } );

    it( "skips malformed segments without an '='", () => {
        expect( parseCookie( "garbage; token=ok" ) ).toEqual( { token: "ok" } );
    } );
} );
