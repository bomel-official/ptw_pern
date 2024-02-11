import React, {useCallback, useEffect, useState} from 'react';
import {useRoutes} from './routes'
import {BrowserRouter as Router} from "react-router-dom";
import {PreLoader} from "./components/base/PreLoader";
import {useAuth} from "./hooks/auth.hook";
import { AuthContext } from './context/AuthContext';
import {useLanguage} from "./hooks/language.hook";
import {LanguageContext} from "./context/LanguageContext";
import {GameContext} from "./context/GameContext";
import {useGame} from "./hooks/game.hook";
import {IUser} from "./StoreTypes";
import {useHttp} from "./hooks/http.hook";
import {Provider} from "react-redux";
import {store} from "./store";

function App() {
    const {token, login, logout, userId} = useAuth()

    const [user, setUser] = useState<null|IUser>(null)
    const [notifications, setNotifications] = useState<number>(0)
    const isAuthenticated = !!user

    const {request} = useHttp()

    const getUser = useCallback(async () => {
        if (userId !== null) {
            const data = userId ? await request(`/api/user/${userId}`, 'GET') : {data: null}
            setUser(data.data)
        }
    }, [setUser, userId])

    useEffect(() => {
        getUser().catch(() => null)
    }, [userId])

    const fetchFriends = useCallback(async () => {
        if (user && user.id) {
            const data = await request(`/api/friend/friend-requests/${user.id}`, 'GET')
            setNotifications(data.requests.length)
        }
    }, [user])

    useEffect(() => {
        fetchFriends().catch()
    }, [user])

    const {language, setLanguage} = useLanguage()
    const {game, setGame} = useGame()

    const routes = useRoutes()

    return (
        <AuthContext.Provider value={{
            token, login, logout, isAuthenticated, user: user ? {...user, notifications} : null
        }}>
            <LanguageContext.Provider value={{
                language, setLanguage
            }}>
                <GameContext.Provider value={{
                    game, setGame
                }}>
                    <Provider store={store}>
                        <div className="App">
                            <PreLoader/>
                            <Router>
                                <div className="App-content">
                                    {routes}
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
