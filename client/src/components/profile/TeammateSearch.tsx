import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import {IUser} from "../../StoreTypes";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {__} from "../../multilang/Multilang";
import ProfileTablet from "./ProfileTablet";
import Pagination from "../base/Pagination";
import {useDebounce} from "../../hooks/debounce.hook";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";

const TeammateSearch = () => {
    const [searchList, setSearchList] = useState<IUser[]>([])
    const [displayFriendsList, setDisplayFriendsList] = useState<IUser[]>([])
    const [displayNumber, setDisplayNumber] = useState<number>(4)
    const [page, setPage] = useState<number>(1)
    const [amountPages, setAmountPages] = useState<number>(0)

    const [searchString, setSearchString] = useState<string>('')
    const debouncedString = useDebounce(searchString)

    const {request} = useHttp()

    const fetchUsers = useCallback(async () => {
        const data = debouncedString.length ? await request(`/api/user/?s=${debouncedString}`, 'GET') : {rows: []}
        setSearchList(data.rows)
    }, [debouncedString])

    useEffect(() => {
        fetchUsers().catch(() => null)
    }, [setSearchList, debouncedString])

    useEffect(() => {
        const newAmountPages = Math.ceil(searchList.length / displayNumber)
        setAmountPages(newAmountPages)
        if (newAmountPages < page && newAmountPages !== 0) {
            setPage(newAmountPages)
        }
    }, [displayNumber, searchList, page])

    useEffect(() => {
        const newDisplayFriendsList = []
        const startPos = (page - 1) * displayNumber
        for (let i = startPos; i < startPos + displayNumber; i++) {
            if (searchList[i]) {
                newDisplayFriendsList.push(searchList[i])
            }
        }
        setDisplayFriendsList(newDisplayFriendsList)
    }, [searchList, displayNumber, page])

    return (
        <>
            <h2 className="profile__heading mb12">{__('Поиск тиммейтов')}</h2>
            <label htmlFor="nickname" className="profile__search input-tl mb12">
                <input
                    type="text"
                    name="nickname"
                    placeholder={__('Никнейм игрока')}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                    value={searchString}
                />
            </label>
            <div className="profile__teams-tablet mb24">
                {displayFriendsList.map((friend, index) => (
                    <ProfileTablet key={friend.id} user={friend} actions={{}} type="search"/>
                ))}
                {searchList.length === 0 && <>
                    <p className="text">{__('Пользователи не найдены')}</p>
                </>}
            </div>
            {amountPages !== 0 && <Pagination
                page={page}
                amountPages={amountPages}
                setPage={setPage}
                displayNumber={displayNumber}
                setDisplayNumber={setDisplayNumber}
            />}
        </>
    );
};

export default TeammateSearch;