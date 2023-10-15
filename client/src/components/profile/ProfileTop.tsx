import React, {Dispatch, useContext} from 'react';
import {icons} from "../../data/PlatformIcons";
import {__} from "../../multilang/Multilang";
import {ProfileTabs, ProfileTabsIds} from "../../data/Links";
import {IUser} from "../../StoreTypes";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {AuthContext} from "../../context/AuthContext";

const ProfileTop = ({isOwn, user, setCurrentTab, currentTab}: {
    isOwn: boolean,
    user: IUser | null,
    setCurrentTab?: Dispatch<ProfileTabsIds>,
    currentTab?: ProfileTabsIds
}) => {
    const {logout} = useContext(AuthContext)

    const dateCreated = new Date(Date.parse(user?.createdAt || ''))

    return (
        <div className="side__content-top blackShadow profile">
            <img src={user?.avatar || DefaultUserPic} alt={`${user?.nickname} wallpaper`} className="side__content-top-bg"/>
            <div className="side__container">
                <div className="side__top-flex">
                    <div className="side__top-profile">
                        <div className="side__top-profile-flex">
                            <div className="side__top-profile-left flex">
                                <img src={user?.avatar || DefaultUserPic} alt={user?.nickname} className="side__top-profile-avatar"/>
                                <div className="side__top-profile-info">
                                    <div className="side__top-profile-info-top flex">
                                        <h1 className="side__top-profile-nickname">{user?.nickname}</h1>
                                        <div className="flex-clear mb"></div>
                                        <img className="side__top-profile-platform" alt={user?.platform} src={icons[user?.platform || 'pc']}/>
                                        {user?.activisionId && <div className="side__top-profile-tag">{user?.activisionId}</div>}
                                    </div>
                                    <div className="side__top-profile-info-bottom">
                                        <span>{__('Играет с')} {`${dateCreated.getDate() < 10 ? '0' + dateCreated.getDate() : dateCreated.getDate()}.${(dateCreated.getMonth() + 1) < 10 ? '0' + (dateCreated.getMonth() + 1) : dateCreated.getMonth() + 1}.${dateCreated.getFullYear()}`}</span>
                                    </div>
                                </div>
                            </div>
                            {isOwn && <button
                                className="side__top-profile-logout"
                                onClick={() => logout()}
                            >
                                <span className="mb">{__('Выйти из аккаунта')}</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5"
                                        stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                </svg>
                            </button>}
                        </div>
                    </div>
                </div>
                {isOwn && setCurrentTab && currentTab && <div className="side__tab-headings ds">
                    { Object.values(ProfileTabs).map((tab, index) => (
                        <button
                            onClick={() => setCurrentTab(tab.id)}
                            key={index}
                            className={currentTab === tab.id ? "side__tab-heading active": "side__tab-heading"}
                        >
                            {__(`${tab.name}`)}
                        </button>
                    )) }
                </div>}
            </div>
        </div>
    );
};

export default ProfileTop;