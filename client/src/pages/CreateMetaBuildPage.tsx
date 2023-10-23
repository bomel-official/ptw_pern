import React, {useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {Footer} from "../components/base/Footer";
import {NavLink} from "react-router-dom";
import {__} from "../multilang/Multilang";
import Select from "../components/base/Select";

type IMetaBuildData = Record<string, {value: string|number|null, text: string}>

const defaultData: IMetaBuildData = {
    mode: {
        value: null,
        text: "Выберите режим"
    },
    weaponType: {
        value: null,
        text: "Выберите тип оружия"
    },
    weapon: {
        value: null,
        text: "Выберите оружие"
    }
}

const CreateMetaBuildPage = () => {
    const [data, setData] = useState<IMetaBuildData>(defaultData)
    const getDataEditor = (key: string) => {
        return (value: string|number|null) => {
            console.log(key, value)
            setData({...data, [key]: {value, text: data[key].text}})
        }
    }
    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <NavLink to="/builds" className="build__back">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.832 9.99933H4.16532M4.16532 9.99933L9.99872 4.16602M4.16532 9.99933L9.99872 15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {__("Назад")}
                            </NavLink>
                            <h1 className="side__title">{__(`Конструктор сборок`)}</h1>
                            <div className="build__data-block">
                                <p className="build__label">{__("Общая информация")}</p>
                                <div className="build__grid-row">
                                    <Select
                                        options={[
                                            {
                                                value: 'solo',
                                                text: 'Одиночный'
                                            },
                                            {
                                                value: 'team',
                                                text: 'Командый'
                                            },
                                        ]}
                                        changeValue={getDataEditor('mode')}
                                        defaultText="Выберите режим"
                                    />
                                    <Select
                                        options={[
                                            {
                                                value: 'auto',
                                                text: 'Автоматы'
                                            },
                                            {
                                                value: 'many',
                                                text: 'Пулемёты'
                                            },
                                        ]}
                                        changeValue={getDataEditor('weaponType')}
                                        defaultText="Выберите тип оружия"
                                    />
                                    <Select
                                        options={[
                                            {
                                                value: 'ak-47',
                                                text: 'AK-47'
                                            },
                                            {
                                                value: 'm4a4',
                                                text: 'M4A4'
                                            },
                                        ]}
                                        changeValue={getDataEditor('weapon')}
                                        defaultText="Выберите оружие"
                                    />
                                </div>
                            </div>
                            <div className="build__publish-wrapper">
                                <button className="build__publish button-both-accent">{__("опубликовать сборку")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CreateMetaBuildPage;