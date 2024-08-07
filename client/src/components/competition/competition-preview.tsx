import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { __ } from "../../multilang/Multilang";
import { CompetitionPreviewProps } from "./types";

const CompetitionPreview: FC<CompetitionPreviewProps> = ( { competition, columns } ) => {
    return (
        <li className={ `previewVertical c${ columns }` }>
            <div className="previewVertical__bottom">
                <h3 className="previewVertical__title">{ competition.title }</h3>
                <div className="previewVertical__users">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99999 12.5H4.99999C4.11593 12.5 3.26809 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5M18.3333 17.5V15.8333C18.3328 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6859 3.20892 15.1397 3.79359C15.5935 4.37827 15.8399 5.09736 15.8399 5.8375C15.8399 6.57764 15.5935 7.29673 15.1397 7.88141C14.6859 8.46608 14.0503 8.88308 13.3333 9.06667M10.8333 5.83333C10.8333 7.67428 9.34094 9.16667 7.49999 9.16667C5.65904 9.16667 4.16666 7.67428 4.16666 5.83333C4.16666 3.99238 5.65904 2.5 7.49999 2.5C9.34094 2.5 10.8333 3.99238 10.8333 5.83333Z"
                            stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                    <span>{ competition.participantsAmount } { __( "участников" ) }</span>
                </div>
                <div className="previewVertical__buttons pt32">
                    <NavLink to={ `/competition/${ competition.id }` } className="previewVertical__link">{ __(
                        "Подробнее" ) }</NavLink>
                </div>
            </div>
        </li>
    );
};

export default CompetitionPreview;
