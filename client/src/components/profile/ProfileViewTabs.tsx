import React, {Dispatch, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import {ProfileTabsIds, ProfileViewTabs} from "../../data/Links";
import {NavLink} from "react-router-dom";


const ProfileViewTabsMenu = ({currentTab, url}: {currentTab: ProfileTabsIds, url: string}) => {
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const [defaultTab, setDefaultTab] = useState<{name: string, id: ProfileTabsIds}>({
        name: 'Просмотр',
        id: 'general'
    })

    useEffect(() => {
        setDefaultTab(ProfileViewTabs[currentTab] || ProfileViewTabs['general'] || {
            name: 'Просмотр',
            id: 'general'
        })
    }, [currentTab])

    return (
        <div className="dropdown mb mb24">
            <button
                className="dropdown__current"
                onClick={() => setIsDropdownActive(!isDropdownActive)}
            >
                <span>{__(defaultTab.name)}</span>
                <span className="ml-auto">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </button>
            <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                {Object.values(ProfileViewTabs).map((tab, index) => (
                    (tab && currentTab !== tab.id) && <li className="dropdown__value" key={index}>
                        <NavLink
                            to={`${url}/${tab.id}`}
                            onClick={() => {
                                setIsDropdownActive(false)
                            }}
                        >
                            {__(tab.name)}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileViewTabsMenu;