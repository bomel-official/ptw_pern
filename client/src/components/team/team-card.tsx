import React, { FC } from "react";
import { getFile } from "../../functions/getFile";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { TeamCardProps } from "./types";

const TeamCard: FC<TeamCardProps> = ( { team } ) => {
    return (
        <div className="profileCard__wrapper">
            <div className="profileCard">
                <img src={ getFile( team.avatar ) || DefaultUserPic }
                     alt={ team.name || "Team avatar" }
                     className="profileCard__avatar"/>
                <div className="profileCard__top">
                    <span className="profileCard__nickname">{ team.name }</span>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;
