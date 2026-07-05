import { ParsedCookies } from "../types";

export function parseCookie( cookies: string | undefined ) {
    const data: ParsedCookies = {};
    try {
        if ( cookies ) {
            for ( const cookie of cookies.split( ";" ) ) {
                const separatorIndex = cookie.indexOf( "=" );
                if ( separatorIndex === -1 ) {
                    continue;
                }
                const name = cookie.slice( 0, separatorIndex ).trim();
                const value = cookie.slice( separatorIndex + 1 ).trim();
                data[name] = value;
            }
        }
    } catch ( e ) {
        data.error = true;
    }
    return data;
}
