import { describe, expect, it } from "vitest";
import { AMOUNT_ROUNDS } from "../src/core/constants";
import { calcAmountKills } from "../src/controllers/libs/calc-amount-kills";

describe( "calcAmountKills", () => {
    it( "sums the first AMOUNT_ROUNDS values of the selected row", () => {
        const rows = [
            [ 1, 2, 3, 4, 5, 999 ], // extra column beyond AMOUNT_ROUNDS must be ignored
            [ 10, 0, 0, 0, 0 ],
        ];
        expect( calcAmountKills( rows, 0 ) ).toBe( 15 );
        expect( calcAmountKills( rows, 1 ) ).toBe( 10 );
    } );

    it( "matches the configured number of rounds", () => {
        expect( AMOUNT_ROUNDS ).toBe( 5 );
    } );
} );
