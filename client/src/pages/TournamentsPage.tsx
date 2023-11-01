import {Header} from "../components/base/Header";
import {Footer} from "../components/base/Footer";
import {GameTabs} from "../components/base/GameTabs";
import {sideMenuItems} from "../data/Links";
import {__} from "../multilang/Multilang";
import {SideMenu} from "../components/base/SideMenu";
import React, {useContext, useState} from "react";
import {IResultStatus, ResultStatuses} from "../data/ResultStatuses";
import {GameContext} from "../context/GameContext";
import {Games} from "../data/Games";
import {TournamentsList} from "../components/tournament/TournamentsList";
import SideMobileMenu from "../components/base/SideMobileMenu";

export const TournamentsPage = ({type}: {type: 'hub' | 'tournament'}) => {
    const typeName = (type === 'hub') ? 'Хабы' : 'Турниры'
    const [resultStatus, setResultStatus] = useState<IResultStatus>('active')
    const {game} = useContext(GameContext)

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
                            <h1 className="side__title">{game !== null ? __(`${typeName} по ${Games[game].name}`) : __(`Турниры по Warzone`)}</h1>
                            <h2 className="side__subtitle">{__(`На данной странице вы можете найти ${ResultStatuses[resultStatus].lowerName} ${typeName.toLowerCase()}.`)}</h2>
                            <div className="side__tab-headings">
                                { Object.values(ResultStatuses).map((status, index) => (
                                    <button
                                        key={index}
                                        className={resultStatus === status.id ? "side__tab-heading active": "side__tab-heading"}
                                        onClick={() => setResultStatus(status.id)}
                                    >
                                        {__(`${status.upperName} ${typeName.toLowerCase()}`)}
                                    </button>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <TournamentsList status={resultStatus} columns={2} type={type}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}