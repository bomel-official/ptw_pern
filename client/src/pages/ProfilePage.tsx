import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {IUser} from "../StoreTypes";
import ProfileOwn from "../components/profile/ProfileOwn";
import ProfileView from "../components/profile/ProfileView";

import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

const ProfilePage = () => {
    const {nickname} = useParams()
    const {user} = useContext(AuthContext)

    const [profileUser, setProfileUser] = useState<IUser | null>(null)
    const [isOwn, setIsOwn] = useState<boolean>(false)

    const {request} = useHttp()

    const getUser = useCallback(async () => {
        const data = await request(`/api/user/nickname/${nickname || ''}`, 'GET')
        setProfileUser(data.data || null)
    }, [setProfileUser, nickname])

    useEffect(() => {
        getUser().catch(() => null)
    }, [getUser])

    useEffect(() => {
        setIsOwn((user?.id === profileUser?.id))
    }, [user, profileUser])

    if (isOwn && profileUser) {
        return (
            <ProfileOwn user={profileUser}/>
        )
    } else {
        return (
            <ProfileView user={profileUser}/>
        )
    }
};


export default ProfilePage;