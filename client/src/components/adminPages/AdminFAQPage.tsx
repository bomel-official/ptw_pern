import React from "react";
import { AdminTabs } from "../../data/AdminTabs";
import { sideAdminMenuItems } from "../../data/Links";
import { __ } from "../../multilang/Multilang";
import AdminFaqManage from "../admin/AdminFAQManage";
import { Footer } from "../base/Footer";
import { GameTabs } from "../base/GameTabs";
import { Header } from "../base/Header";
import NavDropdown from "../base/NavDropdown";
import { SideMenu } from "../base/SideMenu";
import SideMobileMenu from "../base/SideMobileMenu";

const AdminFaqPage = () => {
    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={ Object.values( sideAdminMenuItems ) }/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{ __( `Админ-панель: Вопросы и ответы` ) }</h1>
                            <h2 className="side__subtitle">{ __(
                                `На данной странице вы можете редактирвоать записи для страницы FAQ` ) }</h2>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container pb104">
                            <NavDropdown currentTab={ "faq" } tabs={ AdminTabs } defaultTab={ "tournaments" }
                                         url={ `/admin` }/>
                            <AdminFaqManage/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminFaqPage;
