import React from 'react';
import ProfileFriendRequests from "./ProfileFriendRequests";
import ProfileFriends from "./ProfileFriends";
import TeammateSearch from "./TeammateSearch";
import {IUser} from "../../StoreTypes";

const ProfileOwnFriendsTab = ({user}: {user: IUser}) => {
    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <ProfileFriendRequests user={user}/>
                <ProfileFriends user={user}/>
                <TeammateSearch/>
            </div>
        </div>
    )
};

export default ProfileOwnFriendsTab;