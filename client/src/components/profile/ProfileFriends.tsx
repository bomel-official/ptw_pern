import React, {useCallback, useContext, useEffect, useState} from 'react';
import {IUser} from "../../StoreTypes";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "./ProfileTablet";
import Pagination from "../base/Pagination";
import {useHttp} from "../../hooks/http.hook";

const ProfileFriends = ({user}: {user: IUser}) => {
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const [displayFriendsList, setDisplayFriendsList] = useState<IUser[]>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    const {request} = useHttp()

    const fetchFriends = useCallback(async () => {
        const data = await request(`/api/friend/friends/${user.id}`, 'GET')
        setFriendsList(data.friends || [])
    }, [])

    const removeFriendCallback = useCallback(async (user: IUser) => {
        setFriendsList(friendsList.filter((userItem: IUser) => userItem.id !== user.id))
    }, [])

    useEffect(() => {
        if (user.id) {
            fetchFriends().catch()
        }
    }, [user])

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
            {!!amountPages && <><h2 className="profile__heading mb12">{__('Ваши друзья')}</h2>
            <div className="profile__teams-tablet mb24">
                { displayFriendsList.map((friend, index) => (
                    <ProfileTablet key={index} user={friend} actions={{removeFriendCallback}} type="friend"/>
                ))}
            </div>
            <Pagination
                page={page}
                amountPages={amountPages}
                setPage={setPage}
                displayNumber={displayNumber}
                setDisplayNumber={setDisplayNumber}
            /></>}
        </>
    );
};

export default ProfileFriends;