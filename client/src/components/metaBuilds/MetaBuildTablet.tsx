import React, {useCallback, useEffect, useState} from 'react';
import {__, _f} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import Preview from "../../static/images/meta-build-preview.png";
import {icons} from "../../data/PlatformIcons";
import {IBuild, IBuildAttachment} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {getFile} from "../../functions/getFile";

const MetaBuildTablet = ({build}: {build: IBuild}) => {
    const [isActive, setIsActive] = useState(false)
    const [attachments, setAttachments] = useState<Array<IBuildAttachment>>([])

    const dateCreated = new Date(Date.parse(build.createdAt || ''))
    const {loading, request, error, clearError} = useHttp()

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
                                <NavLink to={'userTwitch'}>
                                    <img src={icons.twitchUser} alt="User twitch"/>
                                </NavLink>
                            </div>
                            <div className="meta-build__tags">
                                <div className="meta-build__weapon-type">{_f(build.build_weapon_type, 'title')}</div>
                                <div className="meta-build__date">{`${dateCreated.getDate() < 10 ? '0' + dateCreated.getDate() : dateCreated.getDate()}.${(dateCreated.getMonth() + 1) < 10 ? '0' + (dateCreated.getMonth() + 1) : dateCreated.getMonth() + 1}.${dateCreated.getFullYear()}`}</div>
                            </div>
                        </div>
                        <img src={getFile(build.build_weapon.image)} alt={_f(build.build_weapon, 'title')} className="meta-build__weapon-image"/>
                        <button
                            className={isActive ? "meta-build__show-button active" : "meta-build__show-button"}
                            onClick={() => setIsActive(!isActive)}
                        >
                            <span></span>
                            <span></span>
                        </button>
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
                            {attachment.isNumerable && build.attachments[index] && <>
                                <div className="meta-build__data-item-size">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"
                                         fill="none">
                                        <path
                                            d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002"
                                            stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    <span>{build.attachments[index][2].toFixed(2)}</span>
                                </div>
                                <div className="meta-build__data-item-size">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20"
                                         fill="none">
                                        <path
                                            d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334"
                                            stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                    <span>{build.attachments[index][3].toFixed(2)}</span>
                                </div>
                            </>}
                        </div>
                    </li>))}
                </ul>
            </div>
        </div>
    );
};

export default MetaBuildTablet;