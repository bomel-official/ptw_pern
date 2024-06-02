import { ParsedCookies } from "../types";

export function parseCookie( cookies: string | undefined ) {
    const data: ParsedCookies = {};
    try {
        if ( cookies ) {
            for ( let cookie of cookies.split( ";" ) ) {
                const [ name, value ] = cookie.split( "=" );
                data[name.trim()] = value.trim();
            }
        }
    } catch ( e ) {
        data.error = true;
    }
    return data;
}
