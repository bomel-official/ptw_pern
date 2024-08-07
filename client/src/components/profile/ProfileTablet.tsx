import React, {MouseEvent, useCallback, useContext, useState} from 'react';
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";
import {__} from "../../multilang/Multilang";
import {IUser} from "../../StoreTypes";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/http.hook/http-hook";
import {getFile} from "../../functions/getFile";
import Loader from "../base/Loader";

const ProfileTablet = ({user, actions, type}: {
    user: IUser,
    actions?: {
        removeFriendCallback?: (user: IUser) => void,
        addFriendCallback?: (user: IUser) => void,
        restrictFriendCallback?: (user: IUser) => void,
    },
    type: 'request' | 'friend' | 'search' | 'mini'
}) => {
    const {user: currentUser, token} = useContext(AuthContext)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [isAdded, setIsAdded] = useState<boolean>(false)
    const [isRestricted, setIsRestricted] = useState<boolean>(false)

    const {request, loading} = useHttp()

    const addFriend = useCallback(async () => {
        await request(`/api/friend/add-friend`, 'POST', {to: user.id}, {authorization: `Bearer ${token}`})
        setIsAdded(true)
        if (actions && actions.addFriendCallback) {
            actions.addFriendCallback(user)
        }
    }, [])

    const removeFriend = useCallback(async () => {
        await request(`/api/friend/remove-friend`, 'POST', {to: user.id}, {authorization: `Bearer ${token}`})
        setIsDeleted(true)
        if (actions && actions.removeFriendCallback) {
            actions.removeFriendCallback(user)
        }
    }, [])

    const restrictFriedRequest = useCallback(async () => {
        await request(`/api/friend/remove-friend`, 'POST', {to: user.id}, {authorization: `Bearer ${token}`})
        setIsRestricted(true)
        if (actions && actions.restrictFriendCallback) {
            actions.restrictFriendCallback(user)
        }
    }, [])

    if (currentUser?.id === user.id && type === 'search') {
        return <></>
    }
    return (
        <div className={`team__tablet ${type}`}>
            <div className="rating__team-flex">
                <div className="rating__team-images">
                    <img src={user?.avatar ? getFile(user.avatar) : DefaultUserPic} alt="nickname"/>
                </div>
                <div className="rating__team-nicks">
                    <div className="bold flex">
                        <NavLink to={`/profile/${user.nickname}`}>{user.nickname}</NavLink>
                        <NavLink to={'MultiTwitch'} className="a-img">
                            <img src={icons.video} alt="MultiTwitch"/>
                        </NavLink>
                    </div>
                    { type !== 'mini' && user.activisionId && <div className="text flex">
                        <span>{user.activisionId}</span>
                    </div>}
                </div>
            </div>
            { currentUser?.id !== user.id && type === 'request' && <div className="team__tablet-bottom flex profile">
                {!loading && <>
                    {!loading && !isRestricted && !isAdded && <button className="team__tablet-ignore" onClick={restrictFriedRequest}>
                        <span>{__('Игнорировать')}</span>
                    </button>}
                    {!loading && !isRestricted && !isAdded && <button className="team__tablet-edit" onClick={addFriend}>
                        <span className="ds">{__('Принять заявку')}</span>
                        <span className="mb">{__('Принять')}</span>
                    </button>}
                    {loading && <Loader/>}
                    {isRestricted && <span className="team__tablet-small-info">{__('Отклонено')}</span>}
                    {isAdded && <span className="team__tablet-small-info">{__('Принято')}</span>}
                </>}
                {loading && <Loader/>}
            </div>}
            { currentUser?.id !== user.id && (type === 'friend' || type === 'mini' || type === 'search') && <>
                {(currentUser?.friends.includes(user.id)) && <>
                    <div className="dropdown dropdown-mini">
                        <button
                            className="dropdown__current"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault()
                                e.currentTarget.parentElement?.classList.toggle('active')
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.0007 10.8334C10.4609 10.8334 10.834 10.4603 10.834 10C10.834 9.53978 10.4609 9.16669 10.0007 9.16669C9.54041 9.16669 9.16732 9.53978 9.16732 10C9.16732 10.4603 9.54041 10.8334 10.0007 10.8334Z"
                                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                                <path
                                    d="M15.834 10.8334C16.2942 10.8334 16.6673 10.4603 16.6673 10C16.6673 9.53978 16.2942 9.16669 15.834 9.16669C15.3737 9.16669 15.0007 9.53978 15.0007 10C15.0007 10.4603 15.3737 10.8334 15.834 10.8334Z"
                                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                                <path
                                    d="M4.16732 10.8334C4.62755 10.8334 5.00065 10.4603 5.00065 10C5.00065 9.53978 4.62755 9.16669 4.16732 9.16669C3.70708 9.16669 3.33398 9.53978 3.33398 10C3.33398 10.4603 3.70708 10.8334 4.16732 10.8334Z"
                                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <ul className="dropdown__values">
                            <li className="dropdown__value">
                                {!isDeleted && !loading && <button
                                    onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault()
                                        e.currentTarget.parentElement?.parentElement?.parentElement?.classList.toggle('active')
                                        await removeFriend().catch(e => {
                                        })
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    <span>{__('Удалить из друзей')}</span>
                                </button>}
                                {loading && <Loader/>}
                                {isDeleted && <span className="team__tablet-small-info">{__('Удалён из друзей')}</span>}
                            </li>
                        </ul>
                    </div>
                </>}
                {(!currentUser?.friends.includes(user.id)) && <>
                    <div className="team__tablet-info">
                        <span>{__('Среднее место:')} {user.averagePlace ? user.averagePlace : '-'}</span>
                        <span>{__('Турниров сыграно:')} {user.statsToursPlayed ? user.statsToursPlayed : '-'}</span>
                    </div>
                    <div className="team__tablet-bottom flex profile">
                        {!loading && !isAdded && <button className="team__tablet-edit" onClick={addFriend}>
                            <span>{__('Добавить в друзья')}</span>
                        </button>}
                        {isAdded && <span className="team__tablet-small-info">{__('Заявка отпралена')}</span>}
                        {loading && <Loader/>}
                    </div>
                </>}
            </>}
        </div>
    );
};

export default ProfileTablet;
