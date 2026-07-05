import { describe, expect, it } from "vitest";
import { collectMemberIds, EMPTY_NUMBER_VALUE } from "../src/modules/competition/competition.lib";

const row = ( items: { index: number; items: number[] }[] ) =>
    items.map( ( i ) => ({ ...i, points: 0 }) );

describe( "collectMemberIds", () => {
    it( "flattens the matrix and dedupes member ids", () => {
        const participants = [
            row( [ { index: 0, items: [ 1, 2 ] }, { index: 1, items: [ 2, 3 ] } ] ),
            row( [ { index: 2, items: [ 3, 4 ] } ] ),
        ];
        expect( collectMemberIds( participants ) ).toEqual( [ 1, 2, 3, 4 ] );
    } );

    it( "skips empty slots (index === EMPTY_NUMBER_VALUE)", () => {
        const participants = [
            row( [ { index: EMPTY_NUMBER_VALUE, items: [ 99 ] }, { index: 0, items: [ 5 ] } ] ),
        ];
        expect( collectMemberIds( participants ) ).toEqual( [ 5 ] );
    } );

    it( "returns an empty array for an empty matrix", () => {
        expect( collectMemberIds( [] ) ).toEqual( [] );
    } );
} );
