import React, {MouseEvent, useCallback, useContext, useEffect, useState} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import Preview from "../../static/images/meta-build-preview.png";
import {icons} from "../../data/PlatformIcons";
import {IBuild, IBuildAttachment} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {getFile} from "../../functions/getFile";
import {getSocialLink} from "../../functions/getSocialLink";
import {getDateString} from "../../functions/getDateString";
import {AuthContext} from "../../context/AuthContext";
import {GameVersions} from "../../data/Games";

const MetaBuildTablet = ({build, deleteHandler}: {build: IBuild, deleteHandler: (id: number) => void}) => {
    const {user, token} = useContext(AuthContext)

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [likes, setLikes] = useState<number>(0)

    useEffect(() => {
        setLikes(build.likesCount)
        setIsLiked(user ? build.likes.includes(user.id) : false)
    }, [user])

    const [isActive, setIsActive] = useState(false)
    const [attachments, setAttachments] = useState<Array<IBuildAttachment>>([])

    const dateCreated = new Date(Date.parse(build.createdAt || ''))
    const {loading, request, error, clearError} = useHttp()

    const likeHandler = async () => {
        try {
            const {likes} = await request('/api/build/like', 'POST', {buildId: build.id, userId: user?.id || ''}, {
                Authorization: `Bearer ${token}`
            }, true)
            console.log(likes, likes.length)
            setLikes(likes.length)
            setIsLiked(user ? likes.includes(user.id) : false)
        } catch (e) {}
    }

    const getAttachments = useCallback(async () => {
        let result = {items: []}
        try {
            result = await request(
                `/api/build/attachment/get-all-included?buildId=${build.id}`,
                'GET')
        } catch (e) {}
        setAttachments(result.items)
    }, [])

    useEffect(() => {
        if (isActive && !attachments.length) {
            getAttachments().catch()
        }
    }, [isActive])

    return (
        <div className={isActive ? "meta-build__tablet active" : "meta-build__tablet"}>
            <div className="meta-build__top">
                <div className="meta-build__container">
                    <div className="meta-build__flex">
                        <div className="meta-build__left">
                            <h3 className="meta-build__header">{_f(build.build_weapon, 'title')}</h3>
                            <div className="meta-build__author">
                                <NavLink to={`/profile/${build.user.nickname}`} className="meta-build__author-name">{build.user.nickname}</NavLink>
                                {build.user.twitch && <NavLink target="_blank" to={getSocialLink(build.user.twitch, 'twitch')}>
                                    <img src={icons.twitchUser} alt={`${build.user.nickname} twitch`}/>
                                </NavLink>}
                            </div>
                            <div className="meta-build__tags">
                                <div className="meta-build__mode">
                                    <img src={GameVersions[build.gameVersion].icon} alt="Build game version"/>
                                </div>
                                <div className="meta-build__weapon-type">{_f(build.build_weapon_type, 'title')}</div>
                                <div className="meta-build__date">{getDateString(dateCreated)}</div>
                            </div>
                        </div>
                        {!!build.build_weapon.image && <div className="meta-build__image-wrapper">
                            <img src={getFile(build.build_weapon.image)} alt={_f(build.build_weapon, 'title')}
                                 className="meta-build__weapon-image"/>
                        </div>}
                        <div className="meta-build__buttons">
                            {user && (build.user.id === user.id || (user?.role === 'ADMIN' || user?.role === 'SUPERADMIN')) && <>
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
                                                stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path
                                                d="M15.834 10.8334C16.2942 10.8334 16.6673 10.4603 16.6673 10C16.6673 9.53978 16.2942 9.16669 15.834 9.16669C15.3737 9.16669 15.0007 9.53978 15.0007 10C15.0007 10.4603 15.3737 10.8334 15.834 10.8334Z"
                                                stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path
                                                d="M4.16732 10.8334C4.62755 10.8334 5.00065 10.4603 5.00065 10C5.00065 9.53978 4.62755 9.16669 4.16732 9.16669C3.70708 9.16669 3.33398 9.53978 3.33398 10C3.33398 10.4603 3.70708 10.8334 4.16732 10.8334Z"
                                                stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <ul className="dropdown__values">
                                        <li className="dropdown__value">
                                            <button
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                    e.preventDefault()
                                                    e.currentTarget.parentElement?.parentElement?.parentElement?.classList.toggle('active')
                                                    deleteHandler(build.id)
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                                                        stroke="white" strokeOpacity="0.75" strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                </svg>
                                                <span>{__('Удалить')}</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>}
                            <button
                                className={isActive ? "meta-build__show-button active" : "meta-build__show-button"}
                                onClick={() => setIsActive(!isActive)}
                            >
                                <span></span>
                                <span></span>
                            </button>
                            <button
                                className={isLiked ? "meta-build__like-button active" : "meta-build__like-button"}
                                onClick={() => likeHandler()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.4201 4.58045C19.9184 4.07702 19.3223 3.67758 18.6659 3.40503C18.0095 3.13248 17.3058 2.99219 16.5951 2.99219C15.8844 2.99219 15.1806 3.13248 14.5243 3.40503C13.8679 3.67758 13.2718 4.07702 12.7701 4.58045L12.0001 5.36045L11.2301 4.58045C10.7284 4.07702 10.1323 3.67758 9.47591 3.40503C8.81953 3.13248 8.1158 2.99219 7.40509 2.99219C6.69437 2.99219 5.99065 3.13248 5.33427 3.40503C4.67789 3.67758 4.08176 4.07702 3.58009 4.58045C1.46009 6.70045 1.33009 10.2804 4.00009 13.0004L12.0001 21.0004L20.0001 13.0004C22.6701 10.2804 22.5401 6.70045 20.4201 4.58045Z" stroke="white" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {!!likes && <span>{likes}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={isActive ? "meta-build__bottom active" : "meta-build__bottom"}>
                <ul className="meta-build__data">
                    {attachments.map((attachment, index) => (<li key={index} className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">{_f(attachment, 'title')}</p>
                                <p className="meta-build__data-item-type">{_f(attachment.build_attachment_type, 'title')}</p>
                            </div>
                        </div>
                    </li>))}
                </ul>
            </div>
        </div>
    );
};

export default MetaBuildTablet;