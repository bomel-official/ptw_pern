import React, {useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import SideMobileMenu from "../components/base/SideMobileMenu";
import {__} from "../multilang/Multilang";
import {Footer} from "../components/base/Footer";
import {BuildTypes, IBuildType} from "../data/BuildTypes";


const MetaBuildsPage = () => {
    const [buildType, setBuildType] = useState<IBuildType>('all')

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
                            <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                <h2 className="side__subtitle build__subheading">{__(`Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.`)}</h2>
                                <button className="button-both-accent corner-margin build__create-button">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{__('Создать сборку')}</span>
                                </button>
                            </div>
                            <div className="side__tab-headings">
                                { BuildTypes.map((currentBuildType, index) => (
                                    <button
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

                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MetaBuildsPage;