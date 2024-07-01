import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook/http-hook";
import {__} from "../multilang/Multilang";
import {LoginWith} from "../components/auth/LoginWith";

export const DiscordAuthPage = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(`/profile/${auth.user?.nickname}`)
        }
    }, [auth.user?.nickname])

    return (
        <div className="AuthPage full-height">
            <Header isBackToMain={true}/>
            <div className="auth">
                <div className="auth__content">
                    <h2 className="auth__title">{__('Авторизация')}</h2>
                    <p className="text mb8">{__('Войдите с помощью:')}</p>
                    <LoginWith/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
