import axios from "axios";
import jwt_decode from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { IUser } from "../StoreTypes";
import { API_URL, useHttp } from "./http.hook";

const storageName = "userData";

const parseJwt = ( token: string ) => {
    try {
        return JSON.parse( atob( token.split( "." )[1] ) );
    } catch ( e ) {
        return null;
    }
};

export const useAuth = () => {
    const [ token, setToken ] = useState<string | null>( null );
    const [ ready, setReady ] = useState<boolean>( false );
    const [ userId, setUserId ] = useState<number | null>( null );
    const [ userNickname, setUserNickname ] = useState<string | null>( null );
    const [ userRole, setUserRole ] = useState<string | null>( null );

    const login = useCallback( ( jwtToken: string | null ): void => {
        setToken( jwtToken );

        const decoded: IUser = jwt_decode( jwtToken || "" );
        setUserRole( decoded.role );
        setUserId( decoded.id );
        setUserNickname( decoded.nickname );

        localStorage.setItem( storageName, jwtToken ? jwtToken : "" );
    }, [] );

    const { request } = useHttp();

    const renew = useCallback( async ( reqToken: string ) => {
        const data = await request( "/api/user/renew", "POST", {}, {
            Authorization: `Bearer ${ reqToken }`
        }, true );
        login( data.token );
    }, [] );

    const getUserByCookie = async () => {
        const { data } = await axios.get( API_URL + "/api/auth/get-user-by-cookie", {
            withCredentials: true
        } );
        if ( data.token ) {
            login( data.token );
        }
    };

    const logout = useCallback( () => {
        setToken( null );
        setUserId( null );
        setUserNickname( null );
        setUserRole( null );

        localStorage.removeItem( storageName );
    }, [] );

    useEffect( () => {
        const token = localStorage.getItem( storageName );

        if ( token ) {
            const decodedToken = parseJwt( token );
            if ( decodedToken ) {
                if ( (decodedToken.exp * 1000 < (Date.now() + 6 * 24 * 60 * 60 * 1000)) &&
                    (decodedToken.exp * 1000 > Date.now()) ) {
                    renew( token ).catch( e => {} );
                } else if ( (decodedToken.exp * 1000 >= (Date.now() - 6 * 24 * 60 * 60 * 1000)) ) {
                    login( token );
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } else {
            getUserByCookie().catch( e => {} );
        }
        setReady( true );
    }, [ login ] );

    return { login, logout, token, userId, ready, userNickname, userRole };
};
