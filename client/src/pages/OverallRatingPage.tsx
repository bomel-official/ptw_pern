import React, {useContext, useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {Footer} from "../components/base/Footer";
import {__} from "../multilang/Multilang";
import {NavLink, useLocation} from "react-router-dom";
import {GameContext} from "../context/GameContext";
import {IRatingType, RatingTypes} from "../data/RatingTypes";
import DefaultUserPic from "../static/icons/USERPIC.png";
import {icons} from "../data/PlatformIcons";
import SideMobileMenu from "../components/base/SideMobileMenu";

const OverallRatingPage = () => {
    const {game} = useContext(GameContext)
    const [ratingType, setRatingType] = useState<IRatingType>('team')
    const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false)

    const location = useLocation()

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{__(`Рейтинг ${RatingTypes[ratingType].lowerName} на платформе`)}</h1>
                            <div className="side__tab-headings">
                                { Object.values(RatingTypes).map((type, index) => (
                                    <button
                                        key={index}
                                        className={ratingType === type.id ? "side__tab-heading active": "side__tab-heading"}
                                        onClick={() => setRatingType(type.id)}
                                    >
                                        {__(`${type.upperName} рейтинг`)}
                                    </button>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <div className="rating">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>{__('Никнейм игрока')}</th>
                                        <th>{__('Игра№')} 1</th>
                                        <th>{__('Игра№')} 2</th>
                                        <th>{__('Игра№')} 3</th>
                                        <th>{__('Игра№')} 4</th>
                                        <th>{__('Игра№')} 5</th>
                                        <th>{__('Итого')}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td className="rating__team">
                                            <div className="rating__team-flex">
                                                <div className="rating__team-images">
                                                    <img src={DefaultUserPic} alt="nickname"/>
                                                </div>
                                                <div className="rating__team-nicks">
                                                    <div className="bold flex">
                                                        <span>Мы – растения</span>
                                                        <NavLink to={'MultiTwitch'} className="a-img">
                                                            <img src={icons.video} alt="MultiTwitch"/>
                                                        </NavLink>
                                                    </div>
                                                    <div className="text flex">
                                                        <span>Игрок 1</span>
                                                        <img src={icons.pc} alt="User platform"/>
                                                        <NavLink to={'userTwitch'} className="a-img">
                                                            <img src={icons.twitchUser} alt="User twitch"/>
                                                        </NavLink>
                                                    </div>
                                                    <div className="text flex">
                                                        <span>Игрок 2</span>
                                                        <img src={icons.xbox} alt="User platform"/>
                                                        <NavLink to={'userTwitch'} className="a-img">
                                                            <img src={icons.twitchUser} alt="User twitch"/>
                                                        </NavLink>
                                                    </div>
                                                    <div className="text flex">
                                                        <span>Игрок 3</span>
                                                        <img src={icons.playstation} alt="User platform"/>
                                                        <NavLink to={'userTwitch'} className="a-img">
                                                            <img src={icons.twitchUser} alt="User twitch"/>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text">30 {__('очков')}</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                        </td>
                                        <td>
                                            <div className="text">30 {__('очков')}</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                        </td>
                                        <td>
                                            <div className="text">30 {__('очков')}</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                        </td>
                                        <td>
                                            <div className="text">30 {__('очков')}</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                        </td>
                                        <td>
                                            <div className="text">30 {__('очков')}</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                            <div className="text">10</div>
                                        </td>
                                        <td>
                                            <div className="bold">150 {__('очков')}</div>
                                            <div className="bold">50</div>
                                            <div className="bold">50</div>
                                            <div className="bold">50</div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default OverallRatingPage;