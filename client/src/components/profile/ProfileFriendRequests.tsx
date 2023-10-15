import React, {useEffect, useState} from 'react';
import {IUser} from "../../StoreTypes";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "./ProfileTablet";
import Pagination from "../base/Pagination";

const ProfileFriendRequests = () => {
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const [displayFriendsList, setDisplayFriendsList] = useState<IUser[]>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    useEffect(() => {
        let newFriendsList: IUser[] = [];
        for (const value of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            newFriendsList.push({
                id: value,
                nickname: `user${value}`,
                avatar: UserAvatar,
                platform: 'pc',
                role: 'USER',
                friends: []
            })
        }
        setFriendsList(newFriendsList)
    }, [setFriendsList])

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
            <h2 className="profile__heading mb12">{__('Заявки в друзья')}</h2>
            <div className="profile__teams-tablet mb24">
                { displayFriendsList.map((friend, index) => (
                    <ProfileTablet key={index} user={friend} actions={{}} type="request"/>
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

export default ProfileFriendRequests;