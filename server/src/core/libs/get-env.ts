/**
 * Soft env accessor: returns the value or an empty string when unset.
 * Use only for optional values where an empty string is an acceptable default
 * (e.g. redirect URLs used inside string concatenation).
 */
export function getEnv( envVariable: string | undefined ): string {
    return envVariable ?? "";
}

/**
 * Strict env accessor: throws when the variable is missing or empty.
 * Use for anything security- or correctness-critical (secrets, DB, etc.)
 * so the app fails loudly at startup instead of running with bad config.
 */
export function requireEnv( name: string ): string {
    const value = process.env[name];
    if ( value === undefined || value === "" ) {
        throw new Error( `Missing required environment variable: ${ name }` );
    }
    return value;
}

/**
 * Single source of truth for the JWT signing/verification secret.
 * Previously this was read via `getEnv(getEnv(process.env.JWT_SECRET_KEY))`,
 * which silently produced an empty secret when the env var was unset.
 */
export function getJwtSecret(): string {
    return requireEnv( "JWT_SECRET_KEY" );
}
