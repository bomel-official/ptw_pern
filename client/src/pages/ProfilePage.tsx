import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileOwn from "../components/profile/ProfileOwn";
import ProfileView from "../components/profile/ProfileView";
import { AuthContext } from "../context/AuthContext";
import { ProfileTabsIds } from "../data/Links";

import { useHttp } from "../hooks/http.hook";
import { IUser } from "../StoreTypes";

const ProfilePage = () => {
    const { nickname, currentTab } = useParams();
    const { user } = useContext( AuthContext );

    const [ profileUser, setProfileUser ] = useState<IUser | null>( null );
    const [ isOwn, setIsOwn ] = useState<boolean>( false );

    const { request } = useHttp();

    const getUser = useCallback( async () => {
        const data = await request( `/api/user/nickname/${ nickname || "" }`, "GET" );
        setProfileUser( data.data || null );
    }, [ nickname ] );

    useEffect( () => {
        if ( user && nickname === user.nickname ) {
            setProfileUser( user );
            setIsOwn( true );
        } else {
            getUser().catch( () => {} );
            setIsOwn( false );
        }
    }, [ getUser, nickname, user ] );

    if ( isOwn && user ) {
        return (
            <ProfileOwn user={ user } tab={ currentTab as ProfileTabsIds || "general" }/>
        );
    } else {
        return (
            <ProfileView user={ profileUser } tab={ currentTab as ProfileTabsIds || "general" }/>
        );
    }
};

export default ProfilePage;
