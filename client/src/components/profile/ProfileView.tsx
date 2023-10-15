import React from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {ProfileTabs, sideMenuItems} from "../../data/Links";
import SingleTournamentImage from "../../static/images/TournamentTopImage.jpg";
import {__} from "../../multilang/Multilang";
import {TournamentTabs} from "../../data/SingleTournamentTabs";
import {NavLink} from "react-router-dom";
import {Footer} from "../base/Footer";
import {IUser} from "../../StoreTypes";
import ProfileTop from "./ProfileTop";

const ProfileView = ({user}: {user: IUser | null}) => {
    return (
        <div className="ProfilePage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <ProfileTop user={user} isOwn={false}/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ProfileView;