import React from 'react';
import {__} from "../../multilang/Multilang";
import {IUser} from "../../StoreTypes";

const ProfileStats = ({user}: {user: IUser | null}) => {
    if (!user) return (<></>)
    return (
        <>
            <h2 className="profile__heading mb12">{__('Статистика')}</h2>
            <div className="profile__stats black-corner-both mb48">
                <div className="profile__stats-item">
                    <h3 className="profile__stats-heading mb8">{__('Турниров сыграно')}</h3>
                    <div className="profile__stats-value flex">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.99984 9.16669H8.33317M6.6665 7.50002V10.8334M12.4998 10H12.5082M14.9998 8.33335H15.0082M14.4332 4.16669H5.5665C4.74174 4.16688 3.94633 4.47283 3.33403 5.02541C2.72174 5.57798 2.33604 6.33793 2.2515 7.15835C2.2465 7.20169 2.24317 7.24252 2.23734 7.28502C2.16984 7.84669 1.6665 12.0467 1.6665 13.3334C1.6665 13.9964 1.9299 14.6323 2.39874 15.1011C2.86758 15.57 3.50346 15.8334 4.1665 15.8334C4.99984 15.8334 5.4165 15.4167 5.83317 15L7.0115 13.8217C7.32399 13.5091 7.74785 13.3334 8.18984 13.3334H11.8098C12.2518 13.3334 12.6757 13.5091 12.9882 13.8217L14.1665 15C14.5832 15.4167 14.9998 15.8334 15.8332 15.8334C16.4962 15.8334 17.1321 15.57 17.6009 15.1011C18.0698 14.6323 18.3332 13.9964 18.3332 13.3334C18.3332 12.0459 17.8298 7.84669 17.7623 7.28502C17.7565 7.24335 17.7532 7.20169 17.7482 7.15919C17.6638 6.33861 17.2782 5.57846 16.6659 5.02572C16.0536 4.47297 15.2581 4.1669 14.4332 4.16669Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{user.statsToursPlayed}</span>
                    </div>
                </div>
                <div className="profile__stats-item">
                    <h3 className="profile__stats-heading mb8">{__('Турниров выиграно')}</h3>
                    <div className="profile__stats-value flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6M6 9V2H18V9M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18M4 22H20M10 14.66V17C10 17.55 9.53 17.98 9.03 18.21C7.85 18.75 7 20.24 7 22M14 14.66V17C14 17.55 14.47 17.98 14.97 18.21C16.15 18.75 17 20.24 17 22" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{user.statsToursWon}</span>
                    </div>
                </div>
                <div className="profile__stats-item">
                    <h3 className="profile__stats-heading mb8">{__('Турниров в ТОП 3')}</h3>
                    <div className="profile__stats-value flex">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.6667 10C18.6667 14.6024 14.9357 18.3334 10.3333 18.3334M18.6667 10C18.6667 5.39765 14.9357 1.66669 10.3333 1.66669M18.6667 10H15.3333M10.3333 18.3334C5.73096 18.3334 2 14.6024 2 10M10.3333 18.3334V15M2 10C2 5.39765 5.73096 1.66669 10.3333 1.66669M2 10H5.33333M10.3333 1.66669V5.00002" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{user.statsToursTop3}</span>
                    </div>
                </div>
                <div className="profile__stats-item">
                    <h3 className="profile__stats-heading mb8">{__('Среднее убийств')}</h3>
                    <div className="profile__stats-value flex">
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.6667 10C18.6667 14.6024 14.9357 18.3334 10.3333 18.3334M18.6667 10C18.6667 5.39765 14.9357 1.66669 10.3333 1.66669M18.6667 10H15.3333M10.3333 18.3334C5.73096 18.3334 2 14.6024 2 10M10.3333 18.3334V15M2 10C2 5.39765 5.73096 1.66669 10.3333 1.66669M2 10H5.33333M10.3333 1.66669V5.00002" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{(user.statsAverageKills).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileStats;