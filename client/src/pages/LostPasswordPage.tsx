import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {__} from "../multilang/Multilang";
import {LoginWith} from "../components/auth/LoginWith";

interface IMessageOptions {
    status: string,
    text: null|string
}

export const LostPasswordPage = () => {
    const {loading, request, error, clearError} = useHttp()
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [recoveryForm, setRecoveryForm] = useState({
        email: '', isSent: false
    })

    const changeHandler = (event: any) => {
        setRecoveryForm({ ...recoveryForm, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        setMessageOptions({
            status: 'neg', text: error
        })
    }, [error])

    const recoveryHandler = async (event: any) => {
        event.preventDefault()
        clearError()
        try {
            // const data = await request('/api/user/login', 'POST', {email: recoveryForm.email})
            // if (data.success) {
            //     setRecoveryForm({ ...recoveryForm, isSent: true })
            // }
            setRecoveryForm({ ...recoveryForm, isSent: true })
        } catch (e) {}
    }

    return (
        <div className="AuthPage full-height">
            <Header isBackToMain={true}/>
            <div className="auth">
                <div className="auth__content">
                    <h2 className="auth__title">{__('Восстановление пароля')}</h2>
                    <form className="auth__form" method="POST">
                        { messageOptions.text && <div className="error-message mb24">{messageOptions.text}</div>}
                        { !recoveryForm.isSent && <label htmlFor="email" className="auth__email mb32 input-tl">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={changeHandler}
                                disabled={loading}
                                placeholder={__("Введите e-mail")}
                                value={recoveryForm.email}
                            />
                        </label>}
                        { recoveryForm.isSent && <p className="text">{__('Письмо с новым паролем отправлено на почту')} <b>{recoveryForm.email}</b>. {__('После входа его можно сменить на странице Профиля.')}</p> }
                        { !recoveryForm.isSent && <div className="auth__buttons flex">
                            <NavLink to={'/auth'} className={"auth__gray-button"}>{__('Войти')}</NavLink>
                            <button
                                className="auth__submit"
                                onClick={recoveryHandler}
                                disabled={loading}
                            >
                                <span>{__('Продолжить')}</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>}
                        { recoveryForm.isSent &&  <div className="auth__buttons flex">
                            <button
                                className={"auth__gray-button"}
                                onClick={() => setRecoveryForm({...recoveryForm, isSent: false})}
                            >
                                {__('Назад')}
                            </button>
                            <NavLink to={'/auth'} className={"auth__submit"}>{__('Войти')}</NavLink>
                        </div>}
                            <p className="auth__withText mb">{__('Авторизация с помощью:')}</p>
                        <LoginWith/>
                        <p className="text">{__('*Продолжая Вы соглашаетесь с')} <NavLink to="terms">{__('условиями использования')}</NavLink></p>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}