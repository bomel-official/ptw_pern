import React from 'react';
import {footerMenuItems} from "../../data/Links";
import {NavLink} from "react-router-dom";
import {__} from "../../multilang/Multilang";

const FooterMenu = () => {
    return (
        <ul className="footerMenu">
            {footerMenuItems.map((item) => (
                <li className="footerMenu__item">
                    <NavLink className="footerMenu__item-link" to={item.to}>{__(item.name)}</NavLink>
                </li>
            ))}
        </ul>
    );
};

export default FooterMenu;