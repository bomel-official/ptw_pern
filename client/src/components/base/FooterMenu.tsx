import React from "react";
import { NavLink } from "react-router-dom";
import { footerMenuItems } from "../../data/Links";
import { __ } from "../../multilang/Multilang";

const FooterMenu = () => {
    return (
        <ul className="footerMenu">
            { footerMenuItems.map( ( item ) => (
                <li className="footerMenu__item" key={ item.to }>
                    <NavLink className="footerMenu__item-link" to={ item.to }>{ __( item.name ) }</NavLink>
                </li>
            ) ) }
        </ul>
    );
};

export default FooterMenu;
