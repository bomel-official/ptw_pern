import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {useContext, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {__} from "../multilang/Multilang";
import {LoginWith} from "../components/auth/LoginWith";

interface IMessageOptions {
    status: string,
    text: null|string
}

export const RegisterPage = () => {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const [isRepeatPasswordHidden, setIsRepeatPasswordHidden] = useState(true)
    const navigate = useNavigate()

    const auth = useContext(AuthContext)

    const {loading, request, error, clearError} = useHttp()
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [form, setForm] = useState({
        email: '', password: '', repeatPassword: '', nickname: ''
    })

    const changeHandler = (event: any) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const registerHandler = async () => {
        clearError()
        try {
            const data = await request('/api/user/register', 'POST', {...form})
            auth.login(data.token)
        } catch (e) {}
    }

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
                    <h2 className="auth__title">{__('Регистрация на платформе')}</h2>
                    <form className="auth__form" method="POST">
                        { messageOptions.text && <div className="error-message mb24">{__(messageOptions.text)}</div>}
                        <label htmlFor="email" className="auth__email mb12 input-tl">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={changeHandler}
                                disabled={loading}
                                placeholder={__("Введите e-mail")}
                            />
                        </label>
                        <label htmlFor="nickname" className="auth__email mb12 input">
                            <input
                                type="text"
                                id="nickname"
                                name="nickname"
                                onChange={changeHandler}
                                disabled={loading}
                                placeholder={__("Введите никнейм")}
                            />
                        </label>
                        <div className="auth__row">
                            <label htmlFor="password" className="auth__password mb12 input">
                                <input
                                    type={isPasswordHidden ? "password" : "text"}
                                    id="password"
                                    name="password"
                                    onChange={changeHandler}
                                    disabled={loading}
                                    placeholder={__("Придумайте пароль")}
                                />
                                <button
                                    className={isPasswordHidden ? "auth__password-hide" : "auth__password-hide show"}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsPasswordHidden(!isPasswordHidden)
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.66797 10.0003C1.66797 10.0003 4.16797 4.16699 10.0013 4.16699C15.8346 4.16699 18.3346 10.0003 18.3346 10.0003C18.3346 10.0003 15.8346 15.8337 10.0013 15.8337C4.16797 15.8337 1.66797 10.0003 1.66797 10.0003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10.0013 12.5003C11.382 12.5003 12.5013 11.381 12.5013 10.0003C12.5013 8.61961 11.382 7.50033 10.0013 7.50033C8.62059 7.50033 7.5013 8.61961 7.5013 10.0003C7.5013 11.381 8.62059 12.5003 10.0013 12.5003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </label>

                            <label htmlFor="repeatPassword" className="auth__password mb12 input-br">
                                <input
                                    type={isRepeatPasswordHidden ? "password" : "text"}
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    onChange={changeHandler}
                                    disabled={loading}
                                    placeholder={__("Повторите пароль")}
                                />
                                <button
                                    className={isRepeatPasswordHidden ? "auth__password-hide" : "auth__password-hide show"}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsRepeatPasswordHidden(!isRepeatPasswordHidden)
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.66797 10.0003C1.66797 10.0003 4.16797 4.16699 10.0013 4.16699C15.8346 4.16699 18.3346 10.0003 18.3346 10.0003C18.3346 10.0003 15.8346 15.8337 10.0013 15.8337C4.16797 15.8337 1.66797 10.0003 1.66797 10.0003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M10.0013 12.5003C11.382 12.5003 12.5013 11.381 12.5013 10.0003C12.5013 8.61961 11.382 7.50033 10.0013 7.50033C8.62059 7.50033 7.5013 8.61961 7.5013 10.0003C7.5013 11.381 8.62059 12.5003 10.0013 12.5003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </label>
                        </div>
                        <p className="text mb">{__('*Продолжая Вы соглашаетесь с')} <NavLink to="terms">{__('условиями использования')}</NavLink></p>
                        <div className="auth__buttons flex">
                            <NavLink to={'/auth'} className={"auth__gray-button"}>{__('Уже есть аккаунт')}</NavLink>
                            <button
                                className="auth__submit"
                                onClick={registerHandler}
                                disabled={loading}
                            >
                                <span>{__('Продолжить')}</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <p className="auth__withText mb">{__('Авторизация с помощью:')}</p>
                        <LoginWith/>
                        <p className="text ds">{__('*Продолжая Вы соглашаетесь с')} <NavLink to="terms">{__('условиями использования')}</NavLink></p>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}