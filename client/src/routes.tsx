import React, {useContext} from 'react'
import {Route, Routes} from 'react-router-dom'
import {MainPage} from "./pages/MainPage";
import {AuthPage} from "./pages/AuthPage";
import {RegisterPage} from "./pages/RegisterPage";
import {LostPasswordPage} from "./pages/LostPasswordPage";
import {TournamentsPage} from "./pages/TournamentsPage";
import {SingleTournamentPage} from "./pages/SingleTournamentPage";
import OverallRatingPage from "./pages/OverallRatingPage";
import PanelsPage from "./pages/PanelsPage";
import ProfilePage from "./pages/ProfilePage";
import TeammateSearchPage from "./pages/TeammateSearchPage";
import MetaBuildsPage from "./pages/MetaBuildsPage";
import {AuthContext} from "./context/AuthContext";

export const useRoutes = () => {
    const {isAuthenticated} = useContext(AuthContext)

    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/" element={<MainPage/>} />
                <Route path="/feedback" element={<PanelsPage/>} />
                <Route path="/lost-password" element={<LostPasswordPage/>} />
                <Route path="/tournaments" element={<TournamentsPage type="tournament"/>} />
                <Route path="/hubs" element={<TournamentsPage type="hub"/>} />
                <Route path="/profile/:nickname" element={<ProfilePage/>} />
                <Route path="/tournament/:slug/:currentTab" element={<SingleTournamentPage/>} />
                <Route path="/rating" element={<OverallRatingPage/>} />
                <Route path="/teammate-search" element={<TeammateSearchPage/>} />
                <Route path="/builds" element={<MetaBuildsPage/>} />
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path="/" element={<MainPage/>} />
                <Route path="/feedback" element={<PanelsPage/>} />
                <Route path="/auth" element={<AuthPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/lost-password" element={<LostPasswordPage/>} />
                <Route path="/tournaments" element={<TournamentsPage type="tournament"/>} />
                <Route path="/hubs" element={<TournamentsPage type="hub"/>} />
                <Route path="/profile/:nickname" element={<ProfilePage/>} />
                <Route path="/tournament/:slug/:currentTab" element={<SingleTournamentPage/>} />
                <Route path="/rating" element={<OverallRatingPage/>} />
                <Route path="/teammate-search" element={<TeammateSearchPage/>} />
                <Route path="/builds" element={<MetaBuildsPage/>} />
            </Routes>
        )
    }
}
