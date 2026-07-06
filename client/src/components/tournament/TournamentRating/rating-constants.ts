export const AMOUNT_ROUNDS = 5;

/**
 * Returns a FRESH "rounds hidden" array. Previously a single shared mutable
 * module-level constant (DEFAULT_ROUNDS_HIDDEN) was reused across every
 * participant, so toggling one round's visibility mutated the shared array and
 * leaked to all participants. Always create a new array instead.
 */
export const createRoundsHidden = (): boolean[] => Array( AMOUNT_ROUNDS ).fill( false );
