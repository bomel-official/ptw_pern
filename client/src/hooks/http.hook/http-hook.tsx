import { useCallback, useState } from "react";
import { __ } from "../../multilang/Multilang";

export const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:7000";

export const useHttp = () => {
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState( null );

    const request = useCallback(
        async ( url: string, method: string = "GET", body: any = null, headers: Record<string, string> = {},
                isJson: boolean = true ) => {
            setLoading( true );
            try {
                if ( body && isJson ) {
                    body = JSON.stringify( body );
                    headers["Content-Type"] = "application/json";
                }

                const response = await fetch( API_URL + url, { method, body, headers } );
                const data = await response.json();

                if ( !response.ok ) {
                    throw new Error( data.message || __( "Что-то пошло не так" ) );
                }

                setLoading( false );

                return data;
            } catch ( e: any ) {
                setLoading( false );
                setError( e.message );
                throw e;
            }
        }, [] );

    const clearError = useCallback( () => setError( null ), [] );

    return { loading, request, error, clearError };
};
