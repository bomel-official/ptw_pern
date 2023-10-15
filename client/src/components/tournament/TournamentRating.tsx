import React from 'react';
import {__} from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";

const TournamentRating = () => {
    return (
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
                                    <NavLink to={'MultiTwitch'}>
                                        <img src={icons.video} alt="MultiTwitch"/>
                                    </NavLink>
                                </div>
                                <div className="text flex">
                                    <span>Игрок 1</span>
                                    <img src={icons.pc} alt="User platform"/>
                                    <NavLink to={'userTwitch'}>
                                        <img src={icons.twitchUser} alt="User twitch"/>
                                    </NavLink>
                                </div>
                                <div className="text flex">
                                    <span>Игрок 2</span>
                                    <img src={icons.xbox} alt="User platform"/>
                                    <NavLink to={'userTwitch'}>
                                        <img src={icons.twitchUser} alt="User twitch"/>
                                    </NavLink>
                                </div>
                                <div className="text flex">
                                    <span>Игрок 3</span>
                                    <img src={icons.playstation} alt="User platform"/>
                                    <NavLink to={'userTwitch'}>
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
    );
};

export default TournamentRating;