import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import ProfilePlatform from "./ProfilePlatform";
import {socialItems} from "../../data/Links";
import {IMessageOptions, IUser} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";

const ProfileOwnSettingsTab = ({user}: {user: IUser}) => {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const [isOldPasswordHidden, setIsOldPasswordHidden] = useState(true)

    const [oldPassword, setOldPassword] = useState<string>('')

    const [changedUser, setChangedUser] = useState<any>(user)
    const {request, error, clearError} = useHttp()
    const [messageOptionsProfile, setMessageOptionsProfile] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [messageOptionsPasswords, setMessageOptionsPasswords] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [messageOptionsSocial, setMessageOptionsSocial] = useState<IMessageOptions>({
        status: '', text: ''
    })
    const [messageOptionsPlatform, setMessageOptionsPlatform] = useState<IMessageOptions>({
        status: '', text: ''
    })

    const changeUserField = (key: string, value: string|number|null|File|boolean) => {
        setChangedUser({...changedUser, [key]: value})
    }

    const auth = useContext(AuthContext)

    const saveChanges: () => Promise<IMessageOptions> = async () => {
        const formData = new FormData()
        setMessageOptionsSocial({status: '', text: ''})
        setMessageOptionsProfile({status: '', text: ''})
        setMessageOptionsPasswords({status: '', text: ''})
        setMessageOptionsPlatform({status: '', text: ''})
        try {
            for (let key in changedUser) {
                if (changedUser.hasOwnProperty(key)) {
                    formData.set(key, changedUser[key])
                }
            } // add data to formData from form state
            const {message} = await request('/api/user/edit', 'POST', formData, {
                Authorization: `Bearer ${auth.token}`
            }, false)
            return {status: 'pos', text: message}
        } catch (e) {}
        return {status: 'neg', text: 'Что-то пошло не так...'}
    }

    const savePlatform = async (event: any) => {
        event.preventDefault()
        clearError()
        const messageData = await saveChanges()
        setMessageOptionsPlatform(messageData)
    }

    const saveSocial = async (event: any) => {
        event.preventDefault()
        clearError()
        const messageData = await saveChanges()
        setMessageOptionsSocial(messageData)
    }

    const savePassword = async (event: any) => {
        event.preventDefault()
        clearError()
        if (oldPassword === changedUser.password) {
            const messageData = await saveChanges()
            setMessageOptionsPasswords(messageData)
        } else {
            setMessageOptionsPasswords({
                status: 'neg', text: 'Пароли не совпадают'
            })
        }
    }

    const saveProfile = async (event: any) => {
        event.preventDefault()
        clearError()
        const messageData = await saveChanges()
        setMessageOptionsProfile(messageData)
    }
    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <h2 className="profile__heading mb12">{__('Профиль')}</h2>
                <div className="tournament__sidebar-block mb48">
                    { messageOptionsProfile.text && <div className={`${messageOptionsProfile.status}-message mb24`}>{__(messageOptionsProfile.text)}</div>}
                    <p className="text corner-margin mb8">{__('Никнейм')}</p>
                    <label htmlFor="nickname" className="input-tl mb12">
                        <input
                            type="text"
                            name="nickname"
                            id="nickname"
                            placeholder={__('Никнейм игрока')}
                            value={changedUser.nickname}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeUserField('nickname', e.target.value)}
                        />
                    </label>
                    <label htmlFor="activisionId" className="input mb12">
                        <input
                            type="text"
                            name="activisionId"
                            id="activisionId"
                            placeholder={__('Activision ID')}
                            value={changedUser.activisionId}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeUserField('activisionId', e.target.value)}
                        />
                    </label>
                    <label htmlFor="teamAvatarImage" className="fileInput input-br mb24">
                        <span className="fileInput__text">{changedUser.avatar ? changedUser.avatar.name || changedUser.avatar : __('Загрузить аватар')}</span>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 12.5L15.4283 9.92833C15.1158 9.61588 14.6919 9.44036 14.25 9.44036C13.8081 9.44036 13.3842 9.61588 13.0717 9.92833L5.5 17.5M4.66667 2.5H16.3333C17.2538 2.5 18 3.24619 18 4.16667V15.8333C18 16.7538 17.2538 17.5 16.3333 17.5H4.66667C3.74619 17.5 3 16.7538 3 15.8333V4.16667C3 3.24619 3.74619 2.5 4.66667 2.5ZM9.66667 7.5C9.66667 8.42047 8.92047 9.16667 8 9.16667C7.07953 9.16667 6.33333 8.42047 6.33333 7.5C6.33333 6.57953 7.07953 5.83333 8 5.83333C8.92047 5.83333 9.66667 6.57953 9.66667 7.5Z" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            name="avatar"
                            id="teamAvatarImage"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeUserField('avatar', e.target.files ? e.target.files[0] : null)}
                        />
                    </label>
                    <p className="text corner-margin mb8">{__('Электронная почта')}</p>
                    <label htmlFor="email" className="input-both mb24">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder={__('Никнейм игрока')}
                            value={changedUser.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                e.preventDefault()
                            }}
                            disabled
                        />
                    </label>
                    <button className="button-both-accent corner-margin" onClick={saveProfile}>
                        <span>{__('Сохранить')}</span>
                    </button>
                </div>
                <h2 className="profile__heading mb12">{__('Безопасность')}</h2>
                <div className="tournament__sidebar-block mb48">
                    { messageOptionsPasswords.text && <div className={`${messageOptionsPasswords.status}-message mb24`}>{__(messageOptionsPasswords.text)}</div>}
                    <p className="text corner-margin mb8">{__('Введите новый пароль')}</p>
                    <label htmlFor="password" className="auth__password mb12 input-both">
                        <input
                            type={isPasswordHidden ? "password" : "text"}
                            id="password"
                            name="password"
                            placeholder={__("Новый пароль")}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeUserField('password', e.target.value)}
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
                    <p className="text corner-margin mb8">{__('Введите старый пароль')}</p>
                    <label htmlFor="oldpassword" className="auth__password mb24 input-both">
                        <input
                            type={isOldPasswordHidden ? "password" : "text"}
                            id="oldpassword"
                            name="oldpassword"
                            placeholder={__("Введите старый пароль")}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                        />
                        <button
                            className={isOldPasswordHidden ? "auth__password-hide" : "auth__password-hide show"}
                            onClick={(e) => {
                                e.preventDefault()
                                setIsOldPasswordHidden(!isOldPasswordHidden)
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66797 10.0003C1.66797 10.0003 4.16797 4.16699 10.0013 4.16699C15.8346 4.16699 18.3346 10.0003 18.3346 10.0003C18.3346 10.0003 15.8346 15.8337 10.0013 15.8337C4.16797 15.8337 1.66797 10.0003 1.66797 10.0003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.0013 12.5003C11.382 12.5003 12.5013 11.381 12.5013 10.0003C12.5013 8.61961 11.382 7.50033 10.0013 7.50033C8.62059 7.50033 7.5013 8.61961 7.5013 10.0003C7.5013 11.381 8.62059 12.5003 10.0013 12.5003Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </label>
                    <button className="button-both-accent corner-margin" onClick={savePassword}>
                        <span>{__('Сменить пароль')}</span>
                    </button>
                </div>
                <h2 className="profile__heading mb12">{__('Социальные сети')}</h2>
                <div className="tournament__sidebar-block mb48">
                    { messageOptionsSocial.text && <div className={`${messageOptionsSocial.status}-message mb24`}>{__(messageOptionsSocial.text)}</div>}
                    <div className="pb12">
                        {socialItems.map((item, index) => (
                            <div className="flex mb12" key={index}>
                                <img src={item.icon} alt="" style={{marginRight: '8px', width: '24px', height: '24px'}}/>
                                <label htmlFor={item.name.toLowerCase()} className="input-both" style={{flexGrow: 1}}>
                                    <input
                                        type="text"
                                        name={item.name.toLowerCase()}
                                        id={item.name.toLowerCase()}
                                        placeholder={item.name}
                                        value={changedUser[item.name.toLowerCase()] !== 'null' ? changedUser[item.name.toLowerCase()] || '' : ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => changeUserField(item.name.toLowerCase(), e.target.value)}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                    <button className="button-both-accent corner-margin mt" onClick={saveSocial}>
                        <span>{__('Сохранить')}</span>
                    </button>
                </div>
            </div>
            <div className="tournament__sidebar-box">
                <ProfilePlatform
                    userPlatform={changedUser.platform}
                    changeHandler={(value) => {
                        changeUserField('platform', value)
                    }}
                    submitHandler={savePlatform}
                    messageOptions={messageOptionsPlatform}
                />
            </div>
        </div>
    );
};

export default ProfileOwnSettingsTab;