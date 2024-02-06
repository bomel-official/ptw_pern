import React, {Dispatch, useCallback, useContext, useEffect, useState} from 'react';
import ProfileStats from "./ProfileStats";
import {__} from "../../multilang/Multilang";
import TeamTablet from "./TeamTablet";
import TournamentTablet from "../tournament/TournamentTablet";
import ProfilePlatform from "./ProfilePlatform";
import {IMessageOptions, ITeam, IUser} from "../../StoreTypes";
import {ProfileTabsIds, socialItems} from "../../data/Links";
import ProfileTablet from "./ProfileTablet";
import UserAvatar from "../../static/icons/ANIME.jpg";
import {NavLink} from "react-router-dom";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";
import TeamEditPopup from "../base/TeamEditPopup";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {TournamentsList} from "../tournament/TournamentsList";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import ProfileSocial from "./ProfileSocial";
import {getProfileUrl} from "../../functions/urls";

const ProfileOwnGeneralTab = ({user, setTeamToEditAndActivatePopup, saveTeamToEdit, currentStep, setCurrentStep, isEditTeamFormActive, setIsEditTeamFormActive, teamToEdit, newTeamUsed, messageOptions}: {
    user: IUser,
    setTeamToEditAndActivatePopup: (team: ITeam) => void,
    saveTeamToEdit: () => Promise<ITeam|void>,
    currentStep: number,
    setCurrentStep: Dispatch<number>,
    isEditTeamFormActive: boolean,
    setIsEditTeamFormActive: Dispatch<boolean>,
    newTeamUsed: any,
    teamToEdit: ITeam,
    messageOptions: IMessageOptions
}) => {
    const [friendsList, setFriendsList] = useState<IUser[]>([])
    const {request} = useHttp()
    const [teams, setTeams] = useState<Array<ITeam>>([])

    const fetchFriends = useCallback(async () => {
        const data = await request(`/api/friend/friends/${user.id}`, 'GET')
        setFriendsList(data.friends || [])
    }, [])

    const fetchTeams = useCallback(async () => {
        const {rows} = await request(`/api/team/search?userId=${user.id}&type=part`, 'GET')
        setTeams(rows)
    }, [])

    useEffect(() => {
        if (user && user.id) {
            fetchFriends().catch()
            fetchTeams().catch()
        }
    }, [user])


    return (
        <div className="tournament pb104">
            <div className="tournament__content">
                <ProfileStats user={user}/>
                {!!teams.length && <>
                    <h2 className="profile__heading mb12">{__('Ваши команды')}</h2>
                    <div className="profile__teams-tablet mb48">
                        {teams.map((team, index) => (
                            <TeamTablet
                                key={team.id}
                                team={team}
                                actions={{
                                    setTeamToEditAndActivatePopup,
                                    deleteOrLeaveCallback: (team: ITeam) => {
                                        setTeams(teams.filter(fTeam => fTeam.id !== team.id))
                                    },
                                    editCallback: () => {
                                    }
                                }}
                            />
                        ))}
                        <div className="profile__teams-tablet-bottom">
                            <NavLink
                                className="profile__teams-tablet-more"
                                to={getProfileUrl(user, true, 'teams')}
                            >
                                <span>{__('Перейти к командам')}</span>
                            </NavLink>
                        </div>
                    </div>
                </>}
                <h2 className="profile__heading mb12 ds">{__('Участие в турнирах')}</h2>
                <div className="profile__tournaments-tablet ds">
                    <TournamentsList columns={2}/>
                </div>
            </div>
            <div className="tournament__sidebar-box">
                <>
                    <h2 className="profile__heading mb12">{__('Ваши друзья')}</h2>
                    <div className="tournament__sidebar-block mb32">
                        <div className="profile__teams-tablet mb12">
                            { friendsList.map((friend, index) => (
                                <ProfileTablet key={index} user={friend} actions={{}} type="mini"/>
                            ))}
                        </div>
                        <NavLink
                            className="profile__teams-tablet-more"
                            to={getProfileUrl(user, true, 'friends')}
                        >
                            <span>{__('Перейти к друзьям')}</span>
                        </NavLink>
                    </div>
                </>
                <ProfileSocial user={user}/>
            </div>
            <TeamEditPopup
                newTeamUsed={newTeamUsed}
                isEditTeamFormActive={isEditTeamFormActive}
                setIsEditTeamFormActive={setIsEditTeamFormActive}
                saveTeamToEdit={async () => {
                    const team = await saveTeamToEdit()
                    if (team) {
                        setTeams(teams.map(mTeam => (mTeam.id === team.id ? team : mTeam)))
                    }
                }}
                teamToEdit={teamToEdit}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                messageOptions={messageOptions}
            />
        </div>
    );
};

export default ProfileOwnGeneralTab;