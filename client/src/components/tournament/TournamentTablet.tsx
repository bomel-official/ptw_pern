import React from 'react';
import {ITournament} from "../../StoreTypes";
import Preview from "../../static/images/preview.jpg";
import {__} from "../../multilang/Multilang";
import {IResultStatus} from "../../data/ResultStatuses";

const TournamentTablet = ({tournament, status}: {tournament: ITournament, status: IResultStatus}) => {
    return (
        <div className={`tournament__tablet ${status}`}>
            <img src={Preview} alt="Tournament name" className="tournament__tablet-img"/>
            <div className="tournament__tablet-right">
                <h4 className="tournament__tablet-title mb12">Название турнира</h4>
                <div className="tournament__tablet-place flex">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6M6 9V2H18V9M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18M4 22H20M10 14.66V17C10 17.55 9.53 17.98 9.03 18.21C7.85 18.75 7 20.24 7 22M14 14.66V17C14 17.55 14.47 17.98 14.97 18.21C16.15 18.75 17 20.24 17 22" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>3 {__('место')}</span>
                </div>
            </div>
        </div>
    );
};

export default TournamentTablet;