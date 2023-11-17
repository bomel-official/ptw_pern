import React, {MouseEvent, useState} from 'react';
import {__} from "../../multilang/Multilang";
import {icons} from "../../data/PlatformIcons";
import {PlatformIds, Platforms, Devices,DeviceIds} from "../../data/Platforms";
import {IMessageOptions} from "../../StoreTypes";

const ProfilePlatform = ({userPlatform, changePlatformHandler, submitHandler, messageOptions, userDevice, changeDeviceHandler}: {
    userPlatform: PlatformIds,
    changePlatformHandler: (value: string) => void,
    submitHandler: (event: any) => void,
    messageOptions: IMessageOptions,
    userDevice: DeviceIds,
    changeDeviceHandler: (value: string) => void
}) => {
    return (
        <>
            <h2 className="profile__heading mb12">{__('Ваша платформа')}</h2>
            <div className="tournament__sidebar-block mb32">
                { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
                <div className="text mb8 pl8 pr8">{__('Выберите платформу для игры')}</div>
                <div className="dropdown mb24">
                    <button
                        className="dropdown__current"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()
                            e.currentTarget.parentElement?.classList.toggle('active')
                        }}
                    >
                        <img src={icons[userPlatform]} alt="User platform"/>
                        <span>{__(Platforms[userPlatform].name)}</span>
                        <span className="ml-auto arrow-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </button>
                    <ul className="dropdown__values">
                        {Object.values(Platforms).map((platform, index) => (
                            (platform.id !== userPlatform) && <li className="dropdown__value" key={index}>
                                <button
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault()
                                        e.currentTarget.parentElement?.parentElement?.parentElement?.classList.remove('active')
                                        changePlatformHandler(platform.id)
                                    }}
                                >
                                    <img src={icons[platform.id]} alt="User platform"/>
                                    <span>{__(Platforms[platform.id].name)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text mb8 pl8 pr8">{__('Выберите устройство')}</div>
                <div className="dropdown mb24">
                    <button
                        className="dropdown__current"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()
                            e.currentTarget.parentElement?.classList.toggle('active')
                        }}
                    >
                        <img src={icons[userDevice]} alt="User platform"/>
                        <span>{__(Devices[userDevice].name)}</span>
                        <span className="ml-auto arrow-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    </button>
                    <ul className="dropdown__values">
                        {Object.values(Devices).map((device, index) => (
                            (device.id !== userDevice) && <li className="dropdown__value" key={index}>
                                <button
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault()
                                        e.currentTarget.parentElement?.parentElement?.parentElement?.classList.remove('active')
                                        changeDeviceHandler(device.id)
                                    }}
                                >
                                    <img src={icons[device.id]} alt="User device"/>
                                    <span>{__(Devices[device.id].name)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="button-both-accent corner-margin w100" onClick={submitHandler}>
                    <span>{__('Применить изменения')}</span>
                </button>
            </div>
        </>
    );
};

export default ProfilePlatform;