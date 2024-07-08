import React, { FC, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { getFile } from "../../functions/getFile";
import { isTeam } from "../../guards";
import { COMPETITION_ITEM_DEFAULT } from "../../hooks/competition";
import DefaultUserPic from "../../static/icons/USERPIC.png";
import { ItemCardProps } from "./types";

const CompetitionItemCard: FC<ItemCardProps> = (
    {
        item,
        setItem, isWinner = false,
        isNoPoints = false,
        showClear = false,
        isLink = false
    }
) => {
    return (
        <div className="profileCard__wrapper"
             style={ { minWidth: `${ 88 + 160 * item.items.length + (showClear ? 40 : 0) }px` } }>
            { !!showClear && <button
                className="admin__build-item-delete"
                onClick={ () => setItem ? setItem( COMPETITION_ITEM_DEFAULT ) : null }
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M10 16.6667H17.5M13.75 2.91669C14.0815 2.58517 14.5312 2.39893 15 2.39893C15.2321 2.39893 15.462 2.44465 15.6765 2.53349C15.891 2.62233 16.0858 2.75254 16.25 2.91669C16.4142 3.08085 16.5444 3.27572 16.6332 3.4902C16.722 3.70467 16.7678 3.93455 16.7678 4.16669C16.7678 4.39884 16.722 4.62871 16.6332 4.84319C16.5444 5.05766 16.4142 5.25254 16.25 5.41669L5.83333 15.8334L2.5 16.6667L3.33333 13.3334L13.75 2.91669Z"
                        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button> }
            { item.index !== -1 ? <>
                <div className="profileCard__index">{ item.index }</div>
                { item.items.map( ( itemParticipant, index ) => {
                    const titleFull = isTeam( itemParticipant ) ? itemParticipant.name : itemParticipant.nickname;
                    const title = titleFull.length > 15 ? titleFull.substring( 0, 15 ) + "..." : titleFull;
                    return (
                        <Fragment key={ index }>
                            { index !== 0 && <p className="text" style={ { margin: "0 8px" } }>&</p> }
                            { !isTeam( itemParticipant ) && isLink ?
                                <NavLink to={ `/profile/${ itemParticipant.nickname }` } target="_blank"
                                         className="profileCard">
                                    <img src={ getFile( itemParticipant.avatar ) || DefaultUserPic }
                                         alt={ title }
                                         className="profileCard__avatar"
                                         style={ { marginRight: "4px" } }
                                    />
                                    <div className="profileCard__top">
                                        <span className="profileCard__nickname">{ title }</span>
                                    </div>
                                </NavLink> : <div className="profileCard">
                                    <img src={ getFile( itemParticipant.avatar ) || DefaultUserPic }
                                         alt={ title }
                                         className="profileCard__avatar"
                                         style={ { marginRight: "4px" } }
                                    />
                                    <div className="profileCard__top">
                                        <span className="profileCard__nickname">{ title }</span>
                                    </div>
                                </div> }

                        </Fragment>
                    );
                } ) }
                { !isNoPoints && <>
                    { setItem ? <div className={ `profileCard__points ${ isWinner ? "winner" : "" }` }>
                            <input
                                className="profileCard__input"
                                type="number"
                                width="40px"
                                value={ item.points }
                                onChange={ ( e ) => setItem ? setItem( { ...item, points: parseInt( e.target.value ) } ) :
                                    null }
                            />
                        </div> :
                        <div className={ `profileCard__points ${ isWinner ? "winner" : "" }` }>{ item.points }</div> }
                </> }
            </> : <div className="profileCard">
                <div className="profileCard__top">
                    <span className="profileCard__nickname">-</span>
                </div>
            </div> }
        </div>
    );
};

export default CompetitionItemCard;
