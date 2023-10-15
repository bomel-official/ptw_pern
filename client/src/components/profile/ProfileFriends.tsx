import React, {useCallback, useContext, useEffect, useState} from 'react';
import {IUser} from "../../StoreTypes";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "./ProfileTablet";
import Pagination from "../base/Pagination";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";

const ProfileFriends = ({user}: {user: IUser}) => {
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const [displayFriendsList, setDisplayFriendsList] = useState<IUser[]>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    const {request} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchFriends = useCallback(async () => {
        const data = await request(`/api/user/friends/${user.id}`, 'GET')
        setFriendsList(data.friends)
    }, [])

    const removeFriend = useCallback(async (userID: number) => {
        await request(`/api/user/remove-friend`, 'POST', {to: userID}, {authorization: `Bearer ${token}`})
        setFriendsList(friendsList.filter((userItem: IUser) => userItem.id !== userID))
    }, [])

    useEffect(() => {
        fetchFriends().catch()
    }, [fetchFriends])

    useEffect(() => {
        const newAmountPages = Math.ceil(friendsList.length / displayNumber)
        setAmountPages(newAmountPages)
        if (newAmountPages < page && newAmountPages !== 0) {
            setPage(newAmountPages)
        }
    }, [displayNumber, friendsList, page])

    useEffect(() => {
        const newDisplayFriendsList = []
        const startPos = (page - 1) * displayNumber
        for (let i = startPos; i < startPos + displayNumber; i++) {
            if (friendsList[i]) {
                newDisplayFriendsList.push(friendsList[i])
            }
        }
        setDisplayFriendsList(newDisplayFriendsList)
    }, [friendsList, displayNumber, page])

    return (
        <>
            <h2 className="profile__heading mb12">{__('Ваши друзья')}</h2>
            <div className="profile__teams-tablet mb24">
                { displayFriendsList.map((friend, index) => (
                    <ProfileTablet key={index} user={friend} actions={{removeFriend}} type="friend"/>
                ))}
            </div>
            {amountPages && <Pagination
                page={page}
                amountPages={amountPages}
                setPage={setPage}
                displayNumber={displayNumber}
                setDisplayNumber={setDisplayNumber}
            />}
        </>
    );
};

export default ProfileFriends;