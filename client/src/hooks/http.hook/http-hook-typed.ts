import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export const API_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:7000";

export const useHttp = <TData, TDataDTO = null>() => {
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState<string | null>( null );
    const { token } = useContext( AuthContext );

    const request = useCallback(
        async ( url: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
                body: TDataDTO | null | string | FormData = null,
                headers: Record<string, string> = {},
                isJson: boolean = true ) => {
            setLoading( true );
            try {
                headers["Authorization"] = `Bearer ${ token }`;
                if ( body && isJson ) {
                    body = JSON.stringify( body );
                    headers["Content-Type"] = "application/json";
                }

                const response = await fetch( API_URL + url,
                    { method, body: body as string, headers } );
                const data = await response.json();

                if ( !response.ok ) {
                    throw new Error( data.message || "Что-то пошло не так" );
                }

                setLoading( false );

                return data as TData;
            } catch ( e: any ) {
                setLoading( false );
                setError( e.message );
                throw e;
            }
        }, [ token ] );

    const clearError = useCallback( () => setError( null ), [] );

    return { loading, request, error, clearError, setError };
};
