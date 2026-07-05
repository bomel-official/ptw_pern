import { describe, expect, it } from "vitest";
import { computeParticipantPoints } from "../src/modules/participant/participant.lib";

// AMOUNT_ROUNDS = 5
const places = ( placement: number ) => Array( 5 ).fill( [ -1, placement ] );
const kills = ( perRound: number, players: number ) =>
    Array( players ).fill( Array( 5 ).fill( perRound ) );

describe( "computeParticipantPoints", () => {
    it( "sums placement points + kill points across all rounds and players", () => {
        // placement 2 pts/round * 5 rounds = 10; kills 1/round * 5 rounds * 2 players = 10
        expect( computeParticipantPoints( {
            places: places( 2 ),
            isRoundsHidden: [ false, false, false, false, false ],
            dataArray: kills( 1, 2 ),
            players: 2,
        } ) ).toBe( 20 );
    } );

    it( "skips kill points for hidden rounds but keeps placement points", () => {
        // placement 0; kills counted for 4 of 5 rounds: 1 * 4 * 1 player = 4
        expect( computeParticipantPoints( {
            places: places( 0 ),
            isRoundsHidden: [ true, false, false, false, false ],
            dataArray: kills( 1, 1 ),
            players: 1,
        } ) ).toBe( 4 );
    } );

    it( "counts placement points even when isRoundsHidden is empty", () => {
        expect( computeParticipantPoints( {
            places: places( 3 ),
            isRoundsHidden: [],
            dataArray: kills( 0, 1 ),
            players: 1,
        } ) ).toBe( 15 );
    } );
} );
