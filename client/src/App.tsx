import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PreLoader } from "./components/base/PreLoader";
import { AuthContext } from "./context/AuthContext";
import { GameContext } from "./context/GameContext";
import { LanguageContext } from "./context/LanguageContext";
import { useAuth } from "./hooks/auth.hook";
import { useGame } from "./hooks/game.hook";
import { useHttp } from "./hooks/http.hook/http-hook";
import { useLanguage } from "./hooks/language.hook";
import { useRoutes } from "./routes";
import { store } from "@/app/store";
import { useAppDispatch } from "@/app/store/hooks";
import { setToken } from "@/entities/session";
import { IUser } from "./StoreTypes";

/**
 * Bridges the legacy AuthContext token into the Redux session slice so the RTK
 * Query base query can read the auth token synchronously. Removed once auth
 * fully moves into the session entity (Phase 7).
 */
const SessionSync: React.FC<{ token: string | null }> = ( { token } ) => {
    const dispatch = useAppDispatch();
    useEffect( () => {
        dispatch( setToken( token ) );
    }, [ dispatch, token ] );
    return null;
};

function App() {
    const { token, login, logout, userId } = useAuth();

    const [ user, setUser ] = useState<null | IUser>( null );
    const [ notifications, setNotifications ] = useState<number>( 0 );
    const isAuthenticated = !!user;

    const { request } = useHttp();

    const getUser = useCallback( async () => {
        if ( userId !== null ) {
            const data = userId ? await request( `/api/user/${ userId }`, "GET" ) : { data: null };
            setUser( data.data );
        } else {
            setUser( null );
        }
    }, [ setUser, userId ] );

    useEffect( () => {
        getUser().catch( () => {} );
    }, [ userId ] );

    const fetchFriends = useCallback( async () => {
        if ( user && user.id ) {
            const data = await request( `/api/friend/friend-requests/${ user.id }`, "GET" );
            setNotifications( data.requests.length );
        }
    }, [ user ] );

    useEffect( () => {
        fetchFriends().catch();
    }, [ user ] );

    const { language, setLanguage } = useLanguage();
    const { game, setGame } = useGame();

    const routes = useRoutes();

    return (
        <AuthContext.Provider value={ {
            token, login, logout, isAuthenticated, user: user ? { ...user, notifications } : null
        } }>
            <LanguageContext.Provider value={ {
                language, setLanguage
            } }>
                <GameContext.Provider value={ {
                    game, setGame
                } }>
                    <Provider store={ store }>
                        <SessionSync token={ token }/>
                        <div className="App">
                            <PreLoader/>
                            <Router>
                                <div className="App-content">
                                    { routes }
                                </div>
                            </Router>
                        </div>
                    </Provider>
                </GameContext.Provider>
            </LanguageContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
