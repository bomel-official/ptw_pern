import React, {useCallback, useEffect, useState} from 'react';
import {IFriendRequest, IUser} from "../../StoreTypes";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "./ProfileTablet";
import Pagination from "../base/Pagination";
import {useHttp} from "../../hooks/http.hook/http-hook";

const ProfileFriendRequests = ({user}: {user: IUser}) => {
    const [friendsList, setFriendsList] = useState<IFriendRequest[]>([])
    const [displayFriendsList, setDisplayFriendsList] = useState<IFriendRequest[]>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    const {request} = useHttp()

    const fetchFriends = useCallback(async () => {
        const data = await request(`/api/friend/friend-requests/${user.id}`, 'GET')
        setFriendsList(data.requests)
    }, [])

    const removeRequest = useCallback(async (user: IUser) => {
        setFriendsList(friendsList.filter((reqItem: IFriendRequest) => (reqItem.userToId !== user.id && reqItem.userFromId !== user.id)))
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
            {!!amountPages && <><h2 className="profile__heading mb12">{__('Заявки в друзья')}</h2>
            <div className="profile__teams-tablet mb24">
                { displayFriendsList.map((friend, index) => (
                    <ProfileTablet key={index} user={friend.user_from} actions={{restrictFriendCallback: removeRequest, addFriendCallback: removeRequest}} type="request"/>
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

export default ProfileFriendRequests;
