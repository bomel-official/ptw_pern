import {NavLink} from "react-router-dom";
import {__} from "../../multilang/Multilang";
import React, {Dispatch, useContext} from "react";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {AuthContext} from "../../context/AuthContext";
import {getFile} from "../../functions/getFile";

export const AccountButtons = (props: {
    mobileMenu: {
        isMobileMenuActive: boolean,
        setIsMobileMenuActive: Dispatch<boolean>
    }
}) => {
    const {isAuthenticated, user} = useContext(AuthContext)

    if (isAuthenticated) {
        return (
            <NavLink className="auth__authenticated" to={`/profile/${user?.nickname}`}>
                <div className="rating__team-flex">
                    <div className="rating__team-images">
                        <img src={user?.avatar ? getFile(user.avatar) : DefaultUserPic} alt="nickname"/>
                    </div>
                    <div className="rating__team-nicks">
                        <div className="bold flex" style={{paddingTop: user?.activisionId ? 0 : '9px'}}>
                            <span>{user?.nickname}</span>
                        </div>
                        {user?.activisionId && <div className="text flex">
                            <span>{user?.activisionId}</span>
                        </div>}
                    </div>
                </div>
            </NavLink>
        )
    } else {
        return (
            <div className="auth__nonAuthenticated">
                <NavLink to={'/auth'} className={'auth__login-button'}>
                    <div className="ds">{__('Вход и регистрация')}</div>
                    <div className="mb">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </NavLink>
            </div>
        )
    }
}