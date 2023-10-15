import React, {useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import TeamTablet from "./TeamTablet";
import TeamEditPopup from "../base/TeamEditPopup";
import {ITeam, IUser} from "../../StoreTypes";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";

const ProfileOwnTeamsTab = ({user}: {user: IUser}) => {
    const [userId, setUserId] = useState<number | null>(null)
    const [teamToEdit, setTeamToEdit] = useState<ITeam>(initNewTeam)
    const [isEditTeamFormActive, setIsEditTeamFormActive] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)

    const newTeamUsed = useNewTeam()

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
                <h2 className="profile__heading-big mb12">{__('Ваши команды')}</h2>
                <p className="text">{__('На данной странице вы можете найти команды, в которых вы числитесь на данный момент')}</p>
                <button
                    className="profile__create-button mb48 button-both-accent corner-margin"
                    onClick={() => setTeamToEditAndActivatePopup(initNewTeam)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{__('создать новую команду')}</span>
                </button>
                <h2 className="profile__heading mb12">{__('Созданные вами команды')}</h2>
                <div className="profile__teams-tablet mb48">
                    { [2, 4, 6].map((num, index) => {
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
                </div>
                <h2 className="profile__heading mb12">{__('Команды в которых вы состоите')}</h2>
                <div className="profile__teams-tablet">
                    { [1,3,5,7,9].map((num, index) => {
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
                </div>
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

export default ProfileOwnTeamsTab;