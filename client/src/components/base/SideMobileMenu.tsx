import React, {useState} from 'react';
import {sideMenuItems} from "../../data/Links";
import {__} from "../../multilang/Multilang";
import {NavLink, useLocation} from "react-router-dom";

const SideMobileMenu = () => {
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)
    const location = useLocation()

    return (
        <>
            { (location.pathname in sideMenuItems) && <div className="dropdown mb">
                <button
                    className="dropdown__current"
                    onClick={() => setIsDropdownActive(!isDropdownActive)}
                >
                    <img src={sideMenuItems[location.pathname].icon} alt={sideMenuItems[location.pathname].name} width="20" height="20"/>
                    <span>{__(sideMenuItems[location.pathname].name)}</span>
                    <span className="ml-auto">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                </button>
                <ul className={isDropdownActive ? "dropdown__values active" : "dropdown__values"}>
                    {Object.values(sideMenuItems).map((sideMenuItem, index) => (
                        (location.pathname !== sideMenuItem.to) && <li className="dropdown__value" key={index}>
                            <NavLink to={sideMenuItem.to}>
                                <img src={sideMenuItem.icon} alt={sideMenuItem.name} width="20" height="20"/>
                                <span>{__(sideMenuItem.name)}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>}
        </>
    );
};

export default SideMobileMenu;