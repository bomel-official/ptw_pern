import React, {useContext, useState} from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {ProfileTabs, ProfileTabsIds, sideMenuItems} from "../../data/Links";
import {Footer} from "../base/Footer";
import {IUser} from "../../StoreTypes";
import ProfileTop from "./ProfileTop";
import ProfileTabsMenu from "./ProfileTabs";
import ProfileOwnGeneralTab from "./ProfileOwnGeneralTab";
import ProfileOwnFriendsTab from "./ProfileOwnFriendsTab";
import ProfileOwnSettingsTab from "./ProfileOwnSettingsTab";
import MetaBuildList from "../metaBuilds/MetaBuildList";
import {__} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";


const ProfileOwn = ({user}: {user: IUser}) => {
    const [currentTab, setCurrentTab] = useState<ProfileTabsIds>('general')
    const auth = useContext(AuthContext)

    return (
        <div className="ProfilePage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <ProfileTop user={user} isOwn={true} currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={ProfileTabs}/>
                    <div className="side__content-bottom">
                        <div className="side__container pt24">
                            <ProfileTabsMenu currentTab={currentTab} setCurrentTab={setCurrentTab} />
                            {currentTab === "general" &&
                                <ProfileOwnGeneralTab
                                    user={user}
                                    setCurrentTab={setCurrentTab}
                                />
                            }
                            {currentTab === "friends" &&
                                <ProfileOwnFriendsTab user={user}/>
                            }
                            {/*{currentTab === "teams" &&*/}
                            {/*    <ProfileOwnTeamsTab user={user}/>*/}
                            {/*}*/}
                            {currentTab === "settings" &&
                                <ProfileOwnSettingsTab user={user}/>
                            }
                            {currentTab === "builds" &&
                                <>
                                    <h1 className="side__title">{__(`Мета-сборки`)}</h1>
                                    <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                        <h2 className="side__subtitle build__subheading">{__(`Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.`)}</h2>
                                        <NavLink to="/builds/create"
                                                 className="button-both-accent corner-margin build__create-button">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white"
                                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{__('Создать сборку')}</span>
                                        </NavLink>
                                    </div>
                                    <MetaBuildList userId={user.id}/>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default ProfileOwn;