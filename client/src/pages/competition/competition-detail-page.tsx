import React from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/base/Footer";
import { GameTabs } from "../../components/base/GameTabs";
import { Header } from "../../components/base/Header";
import { SideMenu } from "../../components/base/SideMenu";
import { sideMenuItems } from "../../data/Links";
import { useGetOneCompetition } from "../../hooks/competition";
import CompetitionDetail from "./competition-detail";

const CompetitionDetailPage = () => {
    const { id } = useParams();
    const { data } = useGetOneCompetition( id );

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={ Object.values( sideMenuItems ) }/>
                <div className="side__content">
                    <div className="side__content-bottom">
                        <CompetitionDetail competition={ data }/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CompetitionDetailPage;
