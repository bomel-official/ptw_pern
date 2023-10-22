import React, {useState} from 'react';
import {__} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import Preview from "../../static/images/meta-build-preview.png";
import {icons} from "../../data/PlatformIcons";

const MetaBuildTablet = () => {
    const [isActive, setIsActive] = useState(false)
    return (
        <div className={isActive ? "meta-build__tablet active" : "meta-build__tablet"}>
            <div className="meta-build__top">
                <div className="meta-build__container">
                    <div className="meta-build__flex">
                        <div className="meta-build__left">
                            <h3 className="meta-build__header">{__('Основное оружие сборки')}</h3>
                            <div className="meta-build__author">
                                <NavLink to={"profile/"} className="meta-build__author-name">Ник игрока</NavLink>
                                <NavLink to={'userTwitch'}>
                                    <img src={icons.twitchUser} alt="User twitch"/>
                                </NavLink>
                            </div>
                            <div className="meta-build__tags">
                                <div className="meta-build__mode">Режим</div>
                                <div className="meta-build__weapon-type">Тип оружия</div>
                                <div className="meta-build__date">22.10.2023</div>
                            </div>
                        </div>
                        <img src={Preview} alt={"Hello"} className="meta-build__weapon-image"/>
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
                    <li className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">Обвес</p>
                                <p className="meta-build__data-item-type">Тип обвеса</p>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                        </div>
                    </li>
                    <li className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">Обвес</p>
                                <p className="meta-build__data-item-type">Тип обвеса</p>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                        </div>
                    </li>
                    <li className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">Обвес</p>
                                <p className="meta-build__data-item-type">Тип обвеса</p>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                        </div>
                    </li>
                    <li className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">Обвес</p>
                                <p className="meta-build__data-item-type">Тип обвеса</p>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                        </div>
                    </li>
                    <li className="meta-build__data-item">
                        <div className="meta-build__container meta-build__data-item-container">
                            <div className="meta-build__data-item-left">
                                <p className="meta-build__data-item-title">Обвес</p>
                                <p className="meta-build__data-item-type">Тип обвеса</p>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                            <div className="meta-build__data-item-size">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#EA5B3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>0.00</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MetaBuildTablet;