import React, {useContext, useEffect, useState} from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {ProfileTabs, ProfileTabsIds, sideMenuItems} from "../../data/Links";
import {Footer} from "../base/Footer";
import {IMessageOptions, ITeam, IUser} from "../../StoreTypes";
import ProfileTop from "./ProfileTop";
import ProfileTabsMenu from "./ProfileTabs";
import ProfileOwnGeneralTab from "./ProfileOwnGeneralTab";
import ProfileOwnFriendsTab from "./ProfileOwnFriendsTab";
import ProfileOwnSettingsTab from "./ProfileOwnSettingsTab";
import MetaBuildList from "../metaBuilds/MetaBuildList";
import {__} from "../../multilang/Multilang";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import ProfileOwnTeamsTab from './ProfileOwnTeamsTab';
import {useHttp} from "../../hooks/http.hook";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";


const ProfileOwn = ({user}: {user: IUser}) => {
    const [currentTab, setCurrentTab] = useState<ProfileTabsIds>('general')
    const [teamToEdit, setTeamToEdit] = useState<ITeam>(initNewTeam)
    const [isEditTeamFormActive, setIsEditTeamFormActive] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    const {token} = useContext(AuthContext)

    const newTeamUsed = useNewTeam()
    const {request, error, clearError} = useHttp()

    const setTeamToEditAndActivatePopup = (team: ITeam) => {
        clearError()
        setTeamToEdit(team)
        setIsEditTeamFormActive(true)
        setCurrentStep(0)
    }

    const formData = new FormData()

    useEffect(() => {
        if (error) {
            setMessageOptions({
                status: 'neg',
                text: error
            })
        }
    }, [error])

    const saveTeamToEdit = async () => {
        clearError()
        setMessageOptions({
            status: '', text: ''
        })
        try {
            const teamKeys = Object.keys(newTeamUsed.newTeam) as Array<keyof typeof newTeamUsed.newTeam>
            teamKeys.forEach((key) => {
                if (newTeamUsed.newTeam.hasOwnProperty(key) && key !== 'avatar_path') {
                    if (key === 'avatar') {
                        formData.set(key, newTeamUsed.newTeam.avatar || '')
                    } else if (key === 'players') {
                        formData.set(key, JSON.stringify(newTeamUsed.newTeam.players.map((pl => (pl.id)))))
                    } else {
                        formData.set(key, (newTeamUsed.newTeam[key]) ? JSON.stringify(newTeamUsed.newTeam[key]) : '')
                    }
                }
            })
            formData.set('avatar', newTeamUsed.newTeam.avatar ?? '')
            formData.set('capitanId', JSON.stringify(newTeamUsed.newTeam.capitanId) ?? '')
            formData.set('name', newTeamUsed.newTeam.name ?? '')
            formData.set('players', JSON.stringify(newTeamUsed.newTeam.players.map((player: IUser) => (player.id))))

            const {message, team} = await request(`/api/team/save-create`, 'POST', formData, {
                Authorization: `Bearer ${token}`
            }, false)
            if (team && team.id) {
                newTeamUsed.setNewTeam(team)
                setMessageOptions({
                    status: 'pos', text: message
                })
                setIsEditTeamFormActive(false)
                return team
            }
        } catch (e: any) {
            setMessageOptions({
                status: 'neg', text: e.message
            })
        }
    }

    return (
        <div className="ProfilePage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <ProfileTop user={user} isOwn={true} currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={ProfileTabs}/>
                    <div className="side__content-bottom">
                        <div className="side__container pt24">
                            <ProfileTabsMenu currentTab={currentTab} setCurrentTab={setCurrentTab} />
                            {currentTab === "general" &&
                                <ProfileOwnGeneralTab
                                    user={user}
                                    setCurrentTab={setCurrentTab}
                                    saveTeamToEdit={saveTeamToEdit}
                                    setIsEditTeamFormActive={setIsEditTeamFormActive}
                                    setCurrentStep={setCurrentStep}
                                    currentStep={currentStep}
                                    isEditTeamFormActive={isEditTeamFormActive}
                                    setTeamToEditAndActivatePopup={setTeamToEditAndActivatePopup}
                                    messageOptions={messageOptions}
                                    newTeamUsed={newTeamUsed}
                                    teamToEdit={teamToEdit}
                                />
                            }
                            {currentTab === "friends" &&
                                <ProfileOwnFriendsTab user={user}/>
                            }
                            {currentTab === "teams" &&
                                <ProfileOwnTeamsTab
                                    user={user}
                                    saveTeamToEdit={saveTeamToEdit}
                                    setIsEditTeamFormActive={setIsEditTeamFormActive}
                                    setCurrentStep={setCurrentStep}
                                    currentStep={currentStep}
                                    isEditTeamFormActive={isEditTeamFormActive}
                                    setTeamToEditAndActivatePopup={setTeamToEditAndActivatePopup}
                                    messageOptions={messageOptions}
                                    newTeamUsed={newTeamUsed}
                                    teamToEdit={teamToEdit}
                                />
                            }
                            {currentTab === "settings" &&
                                <ProfileOwnSettingsTab user={user}/>
                            }
                            {currentTab === "builds" &&
                                <>
                                    <h1 className="side__title">{__(`Мета-сборки`)}</h1>
                                    <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                        <h2 className="side__subtitle build__subheading">{__(`Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.`)}</h2>
                                        <NavLink to="/builds/create"
                                                 className="button-both-accent corner-margin build__create-button">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white"
                                                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{__('Создать сборку')}</span>
                                        </NavLink>
                                    </div>
                                    <MetaBuildList userId={user.id}/>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default ProfileOwn;