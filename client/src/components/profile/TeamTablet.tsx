import React, {Dispatch, useContext} from 'react';
import DefaultUserPic from "../../static/icons/USERPIC.png";
import {NavLink} from "react-router-dom";
import {icons} from "../../data/PlatformIcons";
import {__} from "../../multilang/Multilang";
import {ITeam} from "../../StoreTypes";
import TeamMoreActionsDropdown from "./TeamMoreActionsDropdown";
import TeamEditButton from "./TeamEditButton";
import {AuthContext} from "../../context/AuthContext";
import {getFile} from "../../functions/getFile";

export type ITeamActions = {
    setTeamToEditAndActivatePopup: (team: ITeam) => void,
    deleteOrLeaveCallback: (team: ITeam) => void,
    editCallback: (team: ITeam) => void,
}

const TeamTablet = ({team, actions}: {
    team: ITeam,
    actions: ITeamActions
}) => {
    const {user} = useContext(AuthContext)
    return (
        <div className="team__tablet">
            <div className="rating__team-flex">
                <div className="rating__team-images">
                    <img src={getFile(team.avatar) || DefaultUserPic} alt="nickname"/>
                </div>
                <div className="rating__team-nicks">
                    <div className="bold flex">
                        <span>{team.name}</span>
                        <NavLink to={'MultiTwitch'} className="a-img">
                            <img src={icons.video} alt="MultiTwitch"/>
                        </NavLink>
                    </div>
                    <div className="text flex">
                        <span>{team.players.length} {__('игроков')}</span>
                    </div>
                </div>
            </div>
            { user && team.capitanId === user.id && <div className="team__tablet-right flex ds">
                <TeamEditButton team={team} actions={actions} />
            </div> }
            <TeamMoreActionsDropdown team={team} actions={actions} />
            { user && team.capitanId === user.id && <div className="team__tablet-bottom flex mb">
                <TeamEditButton team={team} actions={actions} />
            </div> }
        </div>
    );
};

export default TeamTablet;