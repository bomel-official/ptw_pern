import React, {Dispatch, useState} from 'react';
import {__} from "../../multilang/Multilang";
import {ProfileTabsIds, ProfileTabs} from "../../data/Links";


const ProfileTabsMenu = ({currentTab, setCurrentTab}: {currentTab: ProfileTabsIds, setCurrentTab: Dispatch<ProfileTabsIds>}) => {
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)

    return (
        <div className="dropdown mb mb24">
            <button
                className="dropdown__current"
                onClick={() => setIsDropdownActive(!isDropdownActive)}
            >
                <span>{(currentTab && (currentTab in ProfileTabs)) ? __(ProfileTabs[currentTab].name) : __(ProfileTabs['general'].name)}</span>
                <span className="ml-auto">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
            </button>
            <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                {Object.values(ProfileTabs).map((tab, index) => (
                    (currentTab !== tab.id) && <li className="dropdown__value" key={index}>
                        <button
                            onClick={() => {
                                setCurrentTab(tab.id)
                                setIsDropdownActive(false)
                            }}
                        >
                            {__(tab.name)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileTabsMenu;