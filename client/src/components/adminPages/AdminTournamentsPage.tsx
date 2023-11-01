import React from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {sideAdminMenuItems} from "../../data/Links";
import SideMobileMenu from "../base/SideMobileMenu";
import {__} from "../../multilang/Multilang";
import {Footer} from "../base/Footer";
import AdminTournamentCreate from "../admin/AdminTournamentCreate";
import AdminEditTournaments from "../admin/AdminEditTournaments";

const AdminTournamentsPage = () => {
    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideAdminMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{__(`Админ-панель: Турниры`)}</h1>
                            <h2 className="side__subtitle">{__(`На данной странице вы можете создавать, редактировать и удалять турниры`)}</h2>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container pb104">
                            <AdminTournamentCreate/>
                            <AdminEditTournaments/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminTournamentsPage;