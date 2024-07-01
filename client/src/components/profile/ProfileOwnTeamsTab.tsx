import React, {Dispatch, useEffect, useState} from 'react';
import {__} from "../../multilang/Multilang";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import TeamTablet from "./TeamTablet";
import TeamEditPopup from "../base/TeamEditPopup";
import {IMessageOptions, ITeam, IUser} from "../../StoreTypes";
import {initNewTeam, useNewTeam} from "../../hooks/newTeam.hook";
import {useHttp} from "../../hooks/http.hook/http-hook";

const ProfileOwnTeamsTab = ({user, setTeamToEditAndActivatePopup, saveTeamToEdit, currentStep, setCurrentStep, isEditTeamFormActive, setIsEditTeamFormActive, newTeamUsed, messageOptions}: {
    user: IUser,
    setTeamToEditAndActivatePopup: (team: ITeam) => void,
    saveTeamToEdit: () => Promise<void>,
    currentStep: number,
    setCurrentStep: Dispatch<number>,
    isEditTeamFormActive: boolean,
    setIsEditTeamFormActive: Dispatch<boolean>,
    newTeamUsed: any,
    messageOptions: IMessageOptions
}) => {

    const [ownTeams, setOwnTeams] = useState<Array<ITeam>>([])
    const [partTeams, setPartTeams] = useState<Array<ITeam>>([])

    const {request} = useHttp()

    const fetchTeamsByType = async (type: 'own' | 'part') => {
        const {rows} = await request(`/api/team/search?userId=${user.id}&type=${type}`, 'GET')
        return rows
    }

    useEffect(() => {
        if (user && user.id) {
            fetchTeamsByType('own').then(oTeams => {
                setOwnTeams(oTeams)
            })
            fetchTeamsByType('part').then(pTeams => {
                setPartTeams(pTeams)
            })
        }
    }, [user])

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
                {!!ownTeams.length && <>
                    <h2 className="profile__heading mb12">{__('Созданные вами команды')}</h2>
                    <div className="profile__teams-tablet mb48">
                        {ownTeams.map((team, index) => (
                            <TeamTablet
                                key={team.id}
                                team={team}
                                actions={{
                                    setTeamToEditAndActivatePopup,
                                    deleteOrLeaveCallback: (team: ITeam) => {
                                        setOwnTeams(ownTeams.filter(fTeam => fTeam.id !== team.id))
                                    },
                                    editCallback: () => {
                                    }
                                }}
                            />
                        ))}
                    </div>
                </>}
                {!!partTeams.length && <>
                    <h2 className="profile__heading mb12">{__('Команды в которых вы состоите')}</h2>
                    <div className="profile__teams-tablet mb48">
                        {partTeams.map((team, index) => (
                            <TeamTablet
                                key={team.id}
                                team={team}
                                actions={{
                                    setTeamToEditAndActivatePopup,
                                    deleteOrLeaveCallback: (team: ITeam) => {
                                        setPartTeams(partTeams.filter(fTeam => fTeam.id !== team.id))
                                    },
                                    editCallback: () => {
                                    }
                                }}
                            />
                        ))}
                    </div>
                </>}
                <div className="profile__teams-tablet">
                </div>
            </div>
            <TeamEditPopup
                newTeamUsed={newTeamUsed}
                isEditTeamFormActive={isEditTeamFormActive}
                setIsEditTeamFormActive={setIsEditTeamFormActive}
                saveTeamToEdit={saveTeamToEdit}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                messageOptions={messageOptions}
            />
        </div>
    );
};

export default ProfileOwnTeamsTab;
