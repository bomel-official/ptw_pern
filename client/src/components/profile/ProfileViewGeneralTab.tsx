import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import ProfileStats from "./ProfileStats";
import {__} from "../../multilang/Multilang";
import TeamTablet from "./TeamTablet";
import {IUser} from "../../StoreTypes";
import {ProfileTabsIds, socialItems} from "../../data/Links";
import ProfileTablet from "./ProfileTablet";
import {NavLink} from "react-router-dom";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {TournamentsList} from "../tournament/TournamentsList";
import {useHttp} from "../../hooks/http.hook/http-hook";
import ProfileSocial from "./ProfileSocial";

const ProfileViewGeneralTab = ({user}: {user: IUser}) => {
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const {request} = useHttp()

    const fetchFriends = useCallback(async () => {
        const data = await request(`/api/friend/friends/${user?.id}`, 'GET')
        setFriendsList(data.friends || [])
    }, [])

    useEffect(() => {
        if (user?.id) {
            fetchFriends().catch()
        }
    }, [user])

    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <ProfileStats user={user}/>
                <h2 className="profile__heading mb12 ds">{__('Участие в турнирах')}</h2>
                <div className="profile__tournaments-tablet ds">
                    <TournamentsList columns={2}/>
                </div>
            </div>
            <div className="tournament__sidebar-box">
                <>
                    <h2 className="profile__heading mb12">{__('Друзья')}</h2>
                    <div className="tournament__sidebar-block mb32">
                        <div className="profile__teams-tablet mb12">
                            { friendsList.map((friend, index) => (
                                <ProfileTablet key={index} user={friend} actions={{}} type="mini"/>
                            ))}
                        </div>
                    </div>
                </>
                <ProfileSocial user={user}/>
            </div>
        </div>
    );
};

export default ProfileViewGeneralTab;
