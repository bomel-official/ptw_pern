import React, {Dispatch, useEffect, useState} from 'react';
import ProfileStats from "./ProfileStats";
import {__} from "../../multilang/Multilang";
import TeamTablet from "./TeamTablet";
import TournamentTablet from "../tournament/TournamentTablet";
import ProfilePlatform from "./ProfilePlatform";
import {ITeam, IUser} from "../../StoreTypes";
import {ProfileTabsIds, socialItems} from "../../data/Links";
import ProfileTablet from "./ProfileTablet";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {NavLink} from "react-router-dom";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";
import TeamEditPopup from "../base/TeamEditPopup";
import DefaultUserPic from "../../static/icons/USERPIC.png";

const ProfileOwnGeneralTab = (
    {user, setCurrentTab}: {
        user: IUser | null,
        setCurrentTab: Dispatch<ProfileTabsIds>,
    }) => {
    const [userId, setUserId] = useState<number | null>(null)
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const [teamToEdit, setTeamToEdit] = useState<ITeam>(initNewTeam)
    const [isEditTeamFormActive, setIsEditTeamFormActive] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)

    const newTeamUsed = useNewTeam()

    useEffect(() => {
        let newFriendsList: IUser[] = [];
        for (const value of [0, 1, 2, 3]) {
            newFriendsList.push({
                id: value,
                nickname: `user${value}`,
                avatar: UserAvatar,
                platform: 'pc',
                role: 'USER',
                friends: []
            })
        }
        setFriendsList(newFriendsList)
    }, [setFriendsList])

    useEffect(() => {
        setUserId(1)
    }, [])

    const saveTeamToEdit = (team: ITeam) => {
        newTeamUsed.setNewTeam(initNewTeam)
        setIsEditTeamFormActive(false)
    }

    const setTeamToEditAndActivatePopup = (team: ITeam) => {
        setTeamToEdit(team)
        setIsEditTeamFormActive(true)
        setCurrentStep(0)
    }


    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <ProfileStats user={user}/>
                <h2 className="profile__heading mb12">{__('Ваши команды')}</h2>
                <div className="profile__teams-tablet mb48">
                    { [1,2,3,4].map((num, index) => {
                        const team = {
                            id: num,
                                name: `team${num}`,
                            avatar: null,
                            avatar_path: DefaultUserPic,
                            capitan: null,
                            players: []
                        }
                        return (
                            <TeamTablet
                                key={index}
                                team={team}
                                actions={{
                                    setTeamToEditAndActivatePopup: () => setTeamToEditAndActivatePopup(team)
                                }}
                            />
                        )
                    })}
                    <div className="profile__teams-tablet-bottom">
                        <button
                            className="profile__teams-tablet-more"
                            onClick={() => setCurrentTab('teams')}
                        >
                            <span>{__('Перейти к командам')}</span>
                        </button>
                    </div>
                </div>
                <h2 className="profile__heading mb12 ds">{__('Результаты турниров')}</h2>
                <div className="profile__tournaments-tablet ds">
                    {[1,2,3,4].map((tournament, index) => (
                        <TournamentTablet tournament={tournament} status={'finished'} key={index}/>
                    ))}
                </div>
            </div>
            <div className="tournament__sidebar-box">
                <ProfilePlatform/>
                <>
                    <h2 className="profile__heading mb12">{__('Ваши друзья')}</h2>
                    <div className="tournament__sidebar-block mb32">
                        <div className="profile__teams-tablet mb12">
                            { friendsList.map((friend, index) => (
                                <ProfileTablet key={index} user={friend} actions={{}} type="mini"/>
                            ))}
                        </div>
                        <button
                            className="profile__teams-tablet-more"
                            onClick={() => setCurrentTab('friends')}
                        >
                            <span>{__('Перейти к друзьям')}</span>
                        </button>
                    </div>
                </>
                <>
                    <h2 className="profile__heading mb12">{__('Ваши соц.сети')}</h2>
                    <p className="text">
                        {__('Тут отображаются ваши соц сети, добавить их можно в')} <a href="#" onClick={(e) => {
                            e.preventDefault()
                            setCurrentTab('settings')
                        }}>{__('настройках')}</a>
                    </p>
                    <div className="side__left-social flex">
                        { socialItems.map((value, index) => (
                            <NavLink
                                className="side__left-social-item"
                                to={value.to}
                                key={index}
                                target="_blank"
                            >
                                <img src={value.icon} alt={`Our ${value.name} channel`} width="20" height="20"/>
                            </NavLink>
                        )) }
                    </div>
                </>
            </div>
            <TeamEditPopup
                newTeamUsed={newTeamUsed}
                userId={userId}
                isEditTeamFormActive={isEditTeamFormActive}
                setIsEditTeamFormActive={setIsEditTeamFormActive}
                saveTeamToEdit={saveTeamToEdit}
                teamToEdit={teamToEdit}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
            />
        </div>
    );
};

export default ProfileOwnGeneralTab;