import React, {useState} from 'react';
import {__} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";

const NavDropdown = ({currentTab, tabs, defaultTab, url}: {currentTab: string | undefined, url: string, tabs: Record<string, {slug: string, text: string}>, defaultTab: string}) => {
    const [isDropdownActive, setIsDropdownActive] = useState(false)
    return (
        <div className="dropdown mb mb24">
            <button
                className="dropdown__current"
                onClick={() => setIsDropdownActive(!isDropdownActive)}
            >
                <span>{(currentTab && (currentTab in tabs)) ? __(tabs[currentTab].text) : __(tabs[defaultTab].text)}</span>
                <span className="ml-auto">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
            </button>
            <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                {Object.values(tabs).map((tab, index) => (
                    (currentTab !== tab.slug) && <li className="dropdown__value" key={index}>
                        <NavLink
                            to={`${url}/${tab.slug}`}
                            onClick={() => setIsDropdownActive(false)}
                        >
                            {__(tab.text)}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NavDropdown;