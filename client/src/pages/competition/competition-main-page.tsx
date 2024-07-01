import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Footer } from "../../components/base/Footer";
import { GameTabs } from "../../components/base/GameTabs";
import { Header } from "../../components/base/Header";
import Loader from "../../components/base/Loader";
import { SideMenu } from "../../components/base/SideMenu";
import SideMobileMenu from "../../components/base/SideMobileMenu";
import CompetitionPreview from "../../components/competition/competition-preview";
import { AuthContext } from "../../context/AuthContext";
import { COMPETITION_REQUEST_TYPES, CompetitionRequestTypeId } from "../../data/competition";
import { sideMenuItems } from "../../data/Links";
import { useGetManyCompetition } from "../../hooks/competition";
import { __ } from "../../multilang/Multilang";

const CompetitionMainPage = () => {
    const [ requestType, setRequestType ] = useState<CompetitionRequestTypeId>( CompetitionRequestTypeId.ALL );
    const { data: competitions, loading } = useGetManyCompetition( requestType );
    const { isAuthenticated } = useContext( AuthContext );
    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={ Object.values( sideMenuItems ) }/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{ __( "Турниры сообщества" ) }</h1>
                            { isAuthenticated &&
                                <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                    <h2 className="side__subtitle build__subheading">{ __(
                                        `Вы можете найти турниры, созданные другими игроками или создать свой` ) }</h2>
                                    <NavLink to="/competition/create"
                                             className="button-both-accent corner-margin build__create-button">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white"
                                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>{ __( "Создать турнир" ) }</span>
                                    </NavLink>
                                </div> }
                            <div className="side__tab-headings">
                                { Object.values( COMPETITION_REQUEST_TYPES ).map( ( type, index ) => (
                                    <button
                                        key={ index }
                                        className={ requestType === type.id ? "side__tab-heading active" :
                                            "side__tab-heading" }
                                        onClick={ () => setRequestType( type.id ) }
                                    >
                                        { __( type.label ) }
                                    </button>
                                ) ) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            { !loading && !!competitions && <ul className="tournamentsList">
                                { competitions.map( competition => (
                                    <CompetitionPreview competition={ competition } columns={ 3 }/>
                                ) ) }
                            </ul> }
                            { loading && <Loader/> }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CompetitionMainPage;
