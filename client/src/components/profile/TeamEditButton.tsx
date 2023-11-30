import React from 'react';
import {__} from "../../multilang/Multilang";
import {ITeam} from "../../StoreTypes";
import {ITeamActions} from "./TeamTablet";

const TeamEditButton = ({team, actions}: {team: ITeam, actions: ITeamActions}) => {
    return (
        <button
            className="team__tablet-edit"
            onClick={() => actions.setTeamToEditAndActivatePopup(team)}
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M10 16.6667H17.5M13.75 2.91669C14.0815 2.58517 14.5312 2.39893 15 2.39893C15.2321 2.39893 15.462 2.44465 15.6765 2.53349C15.891 2.62233 16.0858 2.75254 16.25 2.91669C16.4142 3.08085 16.5444 3.27572 16.6332 3.4902C16.722 3.70467 16.7678 3.93455 16.7678 4.16669C16.7678 4.39884 16.722 4.62871 16.6332 4.84319C16.5444 5.05766 16.4142 5.25254 16.25 5.41669L5.83333 15.8334L2.5 16.6667L3.33333 13.3334L13.75 2.91669Z"
                    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{__('Редактировать')}</span>
        </button>
    );
};

export default TeamEditButton;