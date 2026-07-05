import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminFAQPage from "./components/adminPages/AdminFAQPage";
import AdminMetaBuildsPage from "./components/adminPages/AdminMetaBuildsPage";
import AdminRoleEditorPage from "./components/adminPages/AdminRoleEditorPage";
import AdminTournamentsPage from "./components/adminPages/AdminTournamentsPage";
import CompetitionDetailPage from "./pages/competition/competition-detail-page";
import CompetitionMainPage from "./pages/competition/competition-main-page";
import Contact from "./pages/Contact";
import { DiscordAuthPage } from "./pages/DiscordAuth";
import { FortuneWheelPage } from "@/pages/fortune-wheel";
import { LostPasswordPage } from "./pages/LostPasswordPage";
import { MainPage } from "./pages/MainPage";
import MetaBuildCreatePage from "./pages/MetaBuildCreatePage";
import MetaBuildsPage from "./pages/MetaBuildsPage";
import OverallRatingPage from "./pages/OverallRatingPage";
import PanelsPage from "./pages/PanelsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import { SingleTournamentPage } from "./pages/SingleTournamentPage";
import TeammateSearchPage from "./pages/TeammateSearchPage";
import { TournamentsPage } from "./pages/TournamentsPage";
import UserRules from "./pages/UserRules";
import { RequireRole } from "@/app/routes/RequireRole";
import { NotFoundPage } from "@/pages/not-found";

const ADMIN_ROLES = [ "ADMIN", "SUPERADMIN" ];

export const useRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={ <MainPage/> }/>
            <Route path="/feedback" element={ <PanelsPage/> }/>
            <Route path="/auth" element={ <DiscordAuthPage/> }/>
            {/*<Route path="/auth" element={<AuthPage/>} />*/ }
            {/*<Route path="/register" element={<RegisterPage/>} />*/ }
            <Route path="/lost-password" element={ <LostPasswordPage/> }/>
            <Route path="/tournaments" element={ <TournamentsPage type="tournament"/> }/>
            <Route path="/hubs" element={ <TournamentsPage type="hub"/> }/>
            <Route path="/profile/:nickname/:currentTab" element={ <ProfilePage/> }/>
            <Route path="/profile/:nickname" element={ <ProfilePage/> }/>
            <Route path="/tournament/:slug/:currentTab" element={ <SingleTournamentPage/> }/>
            <Route path="/rating" element={ <OverallRatingPage/> }/>
            <Route path="/teammate-search" element={ <TeammateSearchPage/> }/>
            <Route path="/builds" element={ <MetaBuildsPage/> }/>
            <Route path="/builds/create" element={ <MetaBuildCreatePage/> }/>
            <Route path="/shop" element={ <ShopPage/> }/>
            <Route path="/privacy" element={ <PrivacyPage/> }/>
            <Route path="/user-rules" element={ <UserRules/> }/>
            <Route path="/contact" element={ <Contact/> }/>
            <Route path="/fortune-wheel" element={ <FortuneWheelPage/> }/>
            <Route path="/competition" element={ <CompetitionMainPage/> }/>
            <Route path="/competition/:id" element={ <CompetitionDetailPage/> }/>
            <Route path="/admin/tournaments" element={
                <RequireRole roles={ ADMIN_ROLES }><AdminTournamentsPage/></RequireRole> }/>
            <Route path="/admin/builds" element={
                <RequireRole roles={ ADMIN_ROLES }><AdminMetaBuildsPage/></RequireRole> }/>
            <Route path="/admin/roles" element={
                <RequireRole roles={ ADMIN_ROLES }><AdminRoleEditorPage/></RequireRole> }/>
            <Route path="/admin/faq" element={
                <RequireRole roles={ ADMIN_ROLES }><AdminFAQPage/></RequireRole> }/>
            <Route path="*" element={ <NotFoundPage/> }/>
        </Routes>
    );
};
