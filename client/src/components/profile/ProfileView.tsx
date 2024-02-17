import React, {useEffect, useState} from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {ProfileTabs, ProfileTabsIds, ProfileViewTabs, sideMenuItems} from "../../data/Links";
import {Footer} from "../base/Footer";
import {IUser} from "../../StoreTypes";
import ProfileTop from "./ProfileTop";
import ProfileOwnSettingsTab from "./ProfileOwnSettingsTab";
import ProfileViewGeneralTab from "./ProfileViewGeneralTab";
import ProfileViewTabsMenu from "./ProfileViewTabs";
import MetaBuildList from "../metaBuilds/MetaBuildList";
import {__} from "../../multilang/Multilang";
import {getProfileUrl} from "../../functions/urls";
import ProfileTabsMenu from "./ProfileTabs";

const ProfileView = ({user, tab}: {user: IUser | null, tab: ProfileTabsIds}) => {
    return (
        <div className="ProfilePage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                {!!user && <div className="side__content">
                    <ProfileTop user={user} isOwn={false} currentTab={tab} url={getProfileUrl(user, false)} tabs={ProfileViewTabs}/>
                    <div className="side__content-bottom">
                        <div className="side__container pt24">
                            <ProfileTabsMenu currentTab={tab} url={getProfileUrl(user, false)} tabs={ProfileViewTabs}/>
                            {tab === "general" &&
                                <ProfileViewGeneralTab user={user}/>
                            }
                            {tab === "builds" &&
                                <>
                                    <h1 className="side__title">{__(`Мета-сборки`)}</h1>
                                    <MetaBuildList userId={user.id}/>
                                </>
                            }
                        </div>
                    </div>
                </div>}
            </div>
            <Footer/>
        </div>
    );
};

export default ProfileView;