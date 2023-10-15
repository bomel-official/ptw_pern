import React, {Dispatch} from 'react';
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";
import {__} from "../../multilang/Multilang";
import {ITeam} from "../../StoreTypes";
import TeamMoreActionsDropdown from "./TeamMoreActionsDropdown";
import TeamEditButton from "./TeamEditButton";

const TeamTablet = ({team, actions}: {
    team: ITeam,
    actions: {
        setTeamToEditAndActivatePopup: () => void
    }
}) => {
    return (
        <div className="team__tablet">
            <div className="rating__team-flex">
                <div className="rating__team-images">
                    <img src={team.avatar_path ? team.avatar_path : DefaultUserPic} alt="nickname"/>
                </div>
                <div className="rating__team-nicks">
                    <div className="bold flex">
                        <span>{team.name}</span>
                        <NavLink to={'MultiTwitch'} className="a-img">
                            <img src={icons.video} alt="MultiTwitch"/>
                        </NavLink>
                    </div>
                    <div className="text flex">
                        <span>5 {__('игроков')}</span>
                    </div>
                </div>
            </div>
            { team.id && team.id % 2 === 0 && <div className="team__tablet-right flex ds">
                <TeamEditButton setTeamToEditAndActivatePopup={actions.setTeamToEditAndActivatePopup}/>
            </div> }
            <TeamMoreActionsDropdown team={team}/>
            { team.id && team.id % 2 === 0 && <div className="team__tablet-bottom flex mb">
                <TeamEditButton setTeamToEditAndActivatePopup={actions.setTeamToEditAndActivatePopup}/>
            </div> }
        </div>
    );
};

export default TeamTablet;