import { AMOUNT_ROUNDS } from "./rating-constants";

/** Parse a numeric input value, falling back to `fallback` for empty/NaN. */
export const safeNumber = ( raw: string, fallback = 0 ): number => {
    const parsed = Number( raw );
    return Number.isNaN( parsed ) ? fallback : parsed;
};

/** True when round `i` is explicitly hidden. */
export const isRoundHidden = ( isRoundsHidden: boolean[], i: number ): boolean =>
    isRoundsHidden.length > 0 && !!isRoundsHidden[i];

/** Immutably set matrix[row][col] = value (clones the outer array and the row). */
export const setMatrixCell = (
    matrix: number[][],
    row: number,
    col: number,
    value: number,
): number[][] =>
    matrix.map( ( currentRow, r ) =>
        r === row ? currentRow.map( ( cell, c ) => (c === col ? value : cell) ) : currentRow );

/** Immutably set a places tuple element: places[i][item] = value. */
export const setPlacesCell = (
    places: Array<[ number, number ]>,
    i: number,
    item: 0 | 1,
    value: number,
): Array<[ number, number ]> =>
    places.map( ( pair, index ): [ number, number ] => {
        if ( index !== i ) {
            return pair;
        }
        const next: [ number, number ] = [ pair[0], pair[1] ];
        next[item] = value;
        return next;
    } );

/** Immutably toggle isRoundsHidden[i], normalising the array length first. */
export const toggleRoundHidden = ( isRoundsHidden: boolean[], i: number ): boolean[] => {
    const base = isRoundsHidden.length === AMOUNT_ROUNDS
        ? isRoundsHidden
        : Array( AMOUNT_ROUNDS ).fill( false );
    return base.map( ( hidden, index ) => (index === i ? !hidden : hidden) );
};

export interface RatingTotals {
    /** Total points (placement + kills), skipping hidden rounds' kills. */
    amountPoints: number;
    /** Per-player total kills (hidden rounds excluded). */
    killAmounts: number[];
    /** Per-round point total (placement + all players' kills that round). */
    roundPoints: number[];
}

/**
 * Single source of truth for rating totals — mirrors the server's
 * computeParticipantPoints. Previously this loop was copy-pasted into
 * TournamentRating, ParticipantRequestPopup and AdminParticipantRequest.
 */
export const computeRatingTotals = (
    dataArray: number[][],
    places: Array<[ number, number ]>,
    isRoundsHidden: boolean[],
    players: number,
): RatingTotals => {
    const killAmounts = Array( players ).fill( 0 );
    const roundPoints: number[] = [];
    let amountPoints = 0;

    for ( let i = 0; i < AMOUNT_ROUNDS; i++ ) {
        const hidden = isRoundHidden( isRoundsHidden, i );
        let currentRoundPoints = places[i]?.[1] || 0;
        for ( let j = 0; j < players; j++ ) {
            const kills = dataArray[j]?.[i] || 0;
            if ( !hidden ) {
                killAmounts[j] += kills;
            }
            currentRoundPoints += kills;
        }
        if ( !hidden ) {
            amountPoints += currentRoundPoints;
        }
        roundPoints.push( currentRoundPoints );
    }

    return { amountPoints, killAmounts, roundPoints };
};
