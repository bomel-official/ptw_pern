import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";
import { adminMenuItem, menuItems, socialItems } from "../../data/Links";
import { __ } from "../../multilang/Multilang";

import Logo from "../../static/icons/logo-header.png";
import { AccountButtons } from "./AccountButtons";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = ( props: { isBackToMain?: boolean, borderBottom?: boolean } ) => {
    let headerClassNames = "header no-border-bottom";
    if ( props.borderBottom ) {
        headerClassNames = "header";
    }
    const [ isMobileMenuActive, setIsMobileMenuActive ] = useState<boolean>( false );
    const { user } = useContext( AuthContext );
    const { game } = useContext( GameContext );

    return (
        <div className="header__wrapper">
            <div className={ isMobileMenuActive ? "mobileMenu mb active" : "mobileMenu mb" }>
                <div className="mobileMenu__headerWrapper"></div>
                <div className="mobileMenu__flex">
                    <ul className="mobileMenu__items">
                        { menuItems.map( ( value, index ) => {
                            return game && value.games.includes( game ) ?
                                <li className="mobileMenu__item" key={ index }>
                                    <NavLink
                                        to={ value.to }
                                        onClick={ () => setIsMobileMenuActive( !isMobileMenuActive ) }
                                    >
                                        <img src={ value.icon } alt={ value.name } width="20" height="20"/>
                                        <span>{ __( value.name ) }</span>
                                    </NavLink>
                                </li> : null;
                        } ) }
                        { (user?.role === "ADMIN" || user?.role === "SUPERADMIN") && <li className="mobileMenu__item">
                            <NavLink
                                to={ adminMenuItem.to }
                                onClick={ () => setIsMobileMenuActive( !isMobileMenuActive ) }
                            >
                                <img src={ adminMenuItem.icon } alt={ adminMenuItem.name } width="20" height="20"/>
                                <span>{ adminMenuItem.name }</span>
                            </NavLink>
                        </li> }
                    </ul>
                    <div className="mobileMenu__bottom">
                        <h3 className="mobileMenu__title">Play 2 win</h3>
                        <h4 className="mobileMenu__subtitle">{ __( "Lorem ipsum dolor sit amet consectetur." ) }</h4>
                        <div className="mobileMenu__social flex">
                            { socialItems.map( ( value, index ) => {
                                return <NavLink
                                    className="mobileMenu__social-item"
                                    to={ value.to }
                                    key={ index }
                                    target="_blank"
                                >
                                    <img src={ value.icon } alt={ `Our ${ value.name } channel` } width="20"
                                         height="20"/>
                                </NavLink>;
                            } ) }
                        </div>
                    </div>
                </div>
            </div>
            <header className={ isMobileMenuActive ? headerClassNames + " fixed" : headerClassNames } id="header">
                <div className="">
                    <div className="flex">
                        <div
                            className={ isMobileMenuActive ? "active header__mobileMenu mb" : "header__mobileMenu mb" }>
                            <button
                                className="header__mobileMenu-button"
                                onClick={ () => setIsMobileMenuActive( !isMobileMenuActive ) }
                            >
                            <span className="header__mobileMenu-icon">
                                <i></i>
                                <i></i>
                                <i></i>
                            </span>
                            </button>
                        </div>
                        <NavLink to="/" className="header__logo">
                            <img
                                src={ Logo }
                                alt="Play to win Logo"
                                width="70"
                                height="70"
                                onClick={ () => setIsMobileMenuActive( !isMobileMenuActive ) }
                            />
                        </NavLink>
                        <ul className="header__nav flex">
                            { menuItems.map( ( value, index ) => {
                                return game && value.games.includes( game ) ?
                                    <li className="header__navLink" key={ index }><NavLink to={ value.to }>{ __(
                                        value["name"] ) }</NavLink></li> : null;
                            } ) }
                            { (user?.role === "ADMIN" || user?.role === "SUPERADMIN") &&
                                <li className="header__navLink"><NavLink
                                    to={ adminMenuItem.to }>{ __( adminMenuItem.name ) }</NavLink></li> }
                        </ul>
                        <LanguageSwitcher/>
                        { !props.isBackToMain &&
                            <AccountButtons mobileMenu={ { isMobileMenuActive, setIsMobileMenuActive } }/> }
                        { props.isBackToMain && <NavLink to={ "/" } className={ "header__goBackToMain" }>
                            <div className="ds">{ __( "на главную" ) }</div>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L10 10M10 10L5 15M10 10L5 5M10 10L15 15" stroke="white"
                                      strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </NavLink> }
                    </div>
                </div>
            </header>
        </div>
    );
};
