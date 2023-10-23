import React, {ChangeEvent, useContext, useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import SideMobileMenu from "../components/base/SideMobileMenu";
import {__} from "../multilang/Multilang";
import {Footer} from "../components/base/Footer";
import {BuildTypes, IBuildType} from "../data/BuildTypes";
import {useDebounce} from "../hooks/debounce.hook";
import MetaBuildTablet from "../components/metaBuilds/MetaBuildTablet";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";


const MetaBuildsPage = () => {
    const [buildType, setBuildType] = useState<IBuildType>('all')
    const {isAuthenticated} = useContext(AuthContext)

    const [searchString, setSearchString] = useState<string>('')
    const debouncedString = useDebounce(searchString)

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
                            <h1 className="side__title">{__(`Мета-сборки`)}</h1>
                            { isAuthenticated && <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                <h2 className="side__subtitle build__subheading">{__(`Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.`)}</h2>
                                <NavLink to="/new-build"
                                         className="button-both-accent corner-margin build__create-button">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{__('Создать сборку')}</span>
                                </NavLink>
                            </div>}
                            <div className="side__tab-headings">
                                { Object.entries(BuildTypes).map(([currentBuildTypeId, currentBuildType], index) => (
                                    (currentBuildTypeId === 'all' || isAuthenticated) && <button
                                        key={index}
                                        className={buildType === currentBuildType.id ? "side__tab-heading active": "side__tab-heading"}
                                        onClick={() => setBuildType(currentBuildType.id)}
                                    >
                                        {__(currentBuildType.name)}
                                    </button>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <label htmlFor="build__search" className="build__search input-both mb24">
                                <input
                                    type="text"
                                    name="s"
                                    placeholder={__('Поиск по сборкам')}
                                    className="build__search-input"
                                    value={searchString}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </label>
                            <ul className="build__items">
                                <MetaBuildTablet/>
                                <MetaBuildTablet/>
                                <MetaBuildTablet/>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MetaBuildsPage;