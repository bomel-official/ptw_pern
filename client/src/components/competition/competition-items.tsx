import React, { FC } from "react";
import TeamCard from "../team/team-card";
import UserProfileCard from "../user/user-profile-card";
import { CompetitionItemsProps } from "./types";

const CompetitionItems: FC<CompetitionItemsProps> = ( { teams, type, users, onDelete } ) => {
    return (
        <div className="build__grid-row admin__build-items">
            { type === "user" ? users.map( ( user, index ) => (
                <div key={ user.id } className="admin__build-item">
                    <div className="text" style={ { margin: 0 } }>{ index }.</div>
                    <UserProfileCard user={ user }/>
                    { onDelete && <button className="admin__build-item-delete"
                                          onClick={ () => onDelete ? onDelete( user ) : null }>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                                stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </button> }
                </div>
            ) ) : teams.map( ( team ) => (
                <div key={ team.id } className="admin__build-item">
                    <TeamCard team={ team }/>
                    { onDelete &&
                        <button className="admin__build-item-delete"
                                onClick={ () => onDelete ? onDelete( team ) : null }>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.5 4.99996H17.5M15.8333 4.99996V16.6666C15.8333 17.5 15 18.3333 14.1667 18.3333H5.83333C5 18.3333 4.16667 17.5 4.16667 16.6666V4.99996M6.66667 4.99996V3.33329C6.66667 2.49996 7.5 1.66663 8.33333 1.66663H11.6667C12.5 1.66663 13.3333 2.49996 13.3333 3.33329V4.99996"
                                    stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                        </button> }
                </div>
            ) ) }
        </div>
    );
};

export default CompetitionItems;
