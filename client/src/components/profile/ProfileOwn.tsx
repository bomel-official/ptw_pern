import React, {useState} from 'react';
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


const ProfileOwn = ({user}: {user: IUser}) => {
    const [currentTab, setCurrentTab] = useState<ProfileTabsIds>('general')

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
                                <MetaBuildList userId={user.id}/>
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