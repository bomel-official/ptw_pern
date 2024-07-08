import React, { FC } from "react";
import { getFile } from "../../functions/getFile";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { UserProfileCardProps } from "./types";

const UserProfileCard: FC<UserProfileCardProps> = ( { user } ) => {
    return (
        <div className="profileCard__wrapper">
            <div className="profileCard">
                <img src={ getFile( user.avatar ) || DefaultUserPic }
                     alt={ user.nickname || "User avatar" }
                     className="profileCard__avatar"/>
                <div className="profileCard__top">
                    <span className="profileCard__nickname">{ user.nickname }</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
