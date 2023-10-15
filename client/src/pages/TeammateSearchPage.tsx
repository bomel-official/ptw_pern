import React from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {__} from "../multilang/Multilang";
import {Footer} from "../components/base/Footer";
import SideMobileMenu from "../components/base/SideMobileMenu";
import TeammateSearch from "../components/profile/TeammateSearch";

const TeammateSearchPage = () => {

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
                            <h1 className="side__title">{__(`Поиск тиммейтов`)}</h1>
                            <h2 className="side__subtitle">{__(`На данной странице вы можете найти тиммейтов в команду.`)}</h2>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <TeammateSearch/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default TeammateSearchPage;