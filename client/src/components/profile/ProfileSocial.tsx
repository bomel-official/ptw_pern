import React from 'react';
import {__} from "../../multilang/Multilang";
import {socialItems, socialObjects} from "../../data/Links";
import {NavLink} from "react-router-dom";
import {IUser} from "../../StoreTypes";

const ProfileSocial = ({user}: {user: IUser}) => {
    const {discord, youtube, twitch, twitter} = socialObjects
    return (
        <>
            <h2 className="profile__heading mb12">{__('Соц.сети')}</h2>
            <div className="side__left-social flex">
                <NavLink
                    className="side__left-social-item"
                    to={`${discord.serviceUrl}${user.discord_id}`}
                    target="_blank"
                >
                    <img src={discord.icon} alt={`${user?.nickname}'s ${discord.name} account`} width="20" height="20"/>
                </NavLink>
                <NavLink
                    className="side__left-social-item"
                    to={`${twitch.serviceUrl}${user.twitch}`}
                    target="_blank"
                >
                    <img src={twitch.icon} alt={`${user?.nickname}'s ${twitch.name} account`} width="20" height="20"/>
                </NavLink>
                <NavLink
                    className="side__left-social-item"
                    to={`${twitter.serviceUrl}${user.twitter}`}
                    target="_blank"
                >
                    <img src={twitter.icon} alt={`${user?.nickname}'s ${twitter.name} account`} width="20" height="20"/>
                </NavLink>
                <NavLink
                    className="side__left-social-item"
                    to={`${youtube.serviceUrl}${user.youtube}`}
                    target="_blank"
                >
                    <img src={youtube.icon} alt={`${user?.nickname}'s ${youtube.name} account`} width="20" height="20"/>
                </NavLink>
            </div>
        </>
    );
};
export default ProfileSocial;