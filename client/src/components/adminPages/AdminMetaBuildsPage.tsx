import React from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {sideAdminMenuItems} from "../../data/Links";
import SideMobileMenu from "../base/SideMobileMenu";
import {__} from "../../multilang/Multilang";
import {Footer} from "../base/Footer";
import AdminBuildFieldManage from "../admin/AdminBuildFieldManage";

const AdminMetaBuildsPage = () => {
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
                            <h1 className="side__title">{__(`Админ-панель: Мета сборки`)}</h1>
                            <h2 className="side__subtitle">{__(`На данной странице вы можете создавать, удалять данные для создания мета-сборок`)}</h2>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container pb104">
                            <AdminBuildFieldManage
                                slug={"weapon-type"}
                                columns={2}
                                title={"Типы оружия"}
                                createTitle={"Добавить тип оружия"}
                                deleteTitle={"Редактировать тип оружия"}
                                fields={[
                                    {
                                        title: 'Название RU',
                                        name: 'title_RU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Название EU',
                                        name: 'title_EU',
                                        type: 'text'
                                    }
                                ]}
                            />
                            <AdminBuildFieldManage
                                slug={"weapon"}
                                columns={2}
                                title={"Оружие"}
                                createTitle={"Добавить оружие"}
                                deleteTitle={"Редактировать оружие"}
                                fields={[
                                    {
                                        title: 'Название RU',
                                        name: 'title_RU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Название EU',
                                        name: 'title_EU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Изображение',
                                        name: 'image',
                                        type: 'image'
                                    },
                                    {
                                        title: 'Тип оружия',
                                        name: 'buildWeaponTypeId',
                                        type: 'select',
                                        valuesName: 'weapon-type'
                                    },
                                    {
                                        title: 'Версия игры',
                                        name: 'gameVersion',
                                        type: 'selectGame'
                                    }
                                ]}
                            />
                            <AdminBuildFieldManage
                                slug={"attachment-type"}
                                columns={2}
                                title={"Типы обвесов"}
                                createTitle={"Добавить тип обвеса"}
                                deleteTitle={"Редактировать тип обвеса"}
                                fields={[
                                    {
                                        title: 'Название RU',
                                        name: 'title_RU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Название EU',
                                        name: 'title_EU',
                                        type: 'text'
                                    }
                                ]}
                            />
                            <AdminBuildFieldManage
                                slug={"attachment"}
                                columns={2}
                                title={"Обвесы"}
                                createTitle={"Добавить обвес"}
                                deleteTitle={"Редактировать обвес"}
                                fields={[
                                    {
                                        title: 'Название RU',
                                        name: 'title_RU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Название EU',
                                        name: 'title_EU',
                                        type: 'text'
                                    },
                                    {
                                        title: 'Тип обвеса',
                                        name: 'buildAttachmentTypeId',
                                        type: 'select',
                                        valuesName: 'attachment-type'
                                    },
                                    {
                                        title: 'Версия игры',
                                        name: 'gameVersion',
                                        type: 'selectGame'
                                    },
                                    {
                                        title: 'Использовать диапазоны',
                                        name: 'isNumerable',
                                        type: 'checkbox'
                                    },
                                    {
                                        title: 'Подходит для',
                                        name: 'allowedWeapons',
                                        type: 'checkMatch',
                                        valuesName: 'weapon'
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminMetaBuildsPage;