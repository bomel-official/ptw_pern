import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import {Footer} from "../components/base/Footer";
import {NavLink} from "react-router-dom";
import {__, _f} from "../multilang/Multilang";
import Select from "../components/base/Select";
import {GameVersions, IGameOnlyVersion, IGameVersionObject} from "../data/Games";
import {useHttp} from "../hooks/http.hook/http-hook";
import {IGameOnly} from "../context/GameContext";
import StateSelect from "../components/base/StateSelect";
import {AuthContext} from "../context/AuthContext";
import {IMessageOptions} from "../StoreTypes";

const MAX_ATTACHMENTS = 5

type Attachment = {attachmentType: any, availableAttachments: Array<any>, attachment: any, range: [number, number], isTypeActive: boolean, isAttachmentActive: boolean}
const newAttachment: Attachment = {attachmentType: null, availableAttachments: [], attachment: null, range: [0, 0], isTypeActive: false, isAttachmentActive: false}

const MetaBuildCreatePage = () => {

    const [gameVersion, setGameVersion] = useState<IGameOnlyVersion>('wz')
    const [weaponType, setWeaponType] = useState<any>(null)
    const [weapon, setWeapon] = useState<any>(null)
    const [title, setTitle] = useState<string>("")

    const [isGameVersionSelectActive, setIsGameVersionSelectActive] = useState<boolean>(false)
    const [isWeaponTypeSelectActive, setIsWeaponTypeSelectActive] = useState<boolean>(false)
    const [isWeaponSelectActive, setIsWeaponSelectActive] = useState<boolean>(false)

    const [attachments, setAttachments] = useState<Array<Attachment>>([])

    const [availableAttachmentTypes, setAvailableAttachmentTypes] = useState<Array<any>>([])
    const [weaponTypes, setWeaponTypes] = useState<Array<any>>([])
    const [weapons, setWeapons] = useState<Array<any>>([])

    const {loading, request, error, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const [messageOptions, setMessageOptions] = useState<IMessageOptions>({
        status: '', text: ''
    })

    const getItems = async (itemsSlug: string, params: Record<string, number|string|null> = {}): Promise<any> => {
        let result = {items: []}
        try {
            result = await request(
                `/api/build/admin/${itemsSlug}/get-all?${Object.entries(params).map(([key, value]: [string, number|string|null]) => (value ? `${key}=${value}&` : '')).join('')}`,
                'GET')
        } catch (e) {}
        return result.items
    }

    const addAttachment = () => {
        if (attachments.length < MAX_ATTACHMENTS) {
            setAttachments([...attachments, newAttachment])
        }
    }

    const proceedAttachmentSelects = (i?: number, type?: 'type' | 'attachment', val?: boolean) => {
        if (i !== undefined && type !== undefined && val !== undefined) {
            setAttachments(attachments.map(((att, index) => (
                index !== i ?
                    {
                        ...att,
                        isTypeActive: false,
                        isAttachmentActive: false
                    } :
                    {
                        ...att,
                        isTypeActive: (type === 'type') ? val : false,
                        isAttachmentActive: (type === 'attachment') ? val : false
                    }
            ))))
        } else {
            setAttachments(attachments.map((att => ({...att, isTypeActive: false, isAttachmentActive: false}))))
        }
    }

    const setAttachmentItem = async (setIndex: number, key: string, value: any) => {
        const newAttachments = attachments.map(att => ({...att, isAttachmentActive: false, isTypeActive: false}))
        newAttachments[setIndex] = {...newAttachments[setIndex], [key]: value}
        if (key === 'attachmentType') {
            newAttachments[setIndex].attachment = null
            const availableAttachments = await getItems('attachment', {buildAttachmentTypeId: value.id})
            newAttachments[setIndex] = {
                ...newAttachments[setIndex],
                availableAttachments: availableAttachments.filter((avAtt: any) => (weapon.allowedAttachments.includes(avAtt.id)))
            }
        }
        setAttachments(newAttachments)
    }

    const filterAttachmentTypes = (types: Array<any>) => {
        const usedAttachmentTypes: Array<number> = []
        for (let attachment of attachments) {
            if (attachment.attachmentType) {
                usedAttachmentTypes.push(attachment.attachmentType.id)
            }
        }
        return types.filter(type => !usedAttachmentTypes.includes(type.id))
    }

    const createHandler = async (event: any) => {
        event.preventDefault()
        clearError()
        try {
            const {message} = await request(
                '/api/build/create',
                'POST',
                {
                    gameVersion,
                    title,
                    weaponTypeId: weaponType.id,
                    weaponId: weapon.id,
                    attachments: JSON.stringify(attachments.map((att) => ({
                        attachment: att.attachment.id,
                        attachmentType: att.attachmentType.id,
                        range: att.range
                    })))
                },
                {
                    Authorization: `Bearer ${auth.token}`
                },
                true
            )

            setWeapon(null)
            setWeaponType(null)

            setMessageOptions({
                status: 'pos', text: message
            })
        } catch (e: any) {
            setMessageOptions({
                status: 'neg', text: e.message || "Поля заполнены некорректно..."
            })
        }
    }

    useEffect(() => {
        getItems('attachment-type').then(resItems => setAvailableAttachmentTypes(resItems))
        getItems('weapon-type').then(resItems => setWeaponTypes(resItems))
    }, [])

    useEffect(() => {
        setWeapon(null)

        if (weaponType) {
            getItems('weapon', {gameVersion, buildWeaponTypeId: weaponType.id}).then(resItems => setWeapons(resItems))
        }
    }, [gameVersion])

    useEffect(() => {
        setWeapon(null)

        if (weaponType) {
            getItems('weapon', {gameVersion, buildWeaponTypeId: weaponType.id}).then(resItems => setWeapons(resItems))
        }
    }, [weaponType])

    useEffect(() => {
        setAttachments([])
    }, [weapon])

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <NavLink to="/builds" className="build__back">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.832 9.99933H4.16532M4.16532 9.99933L9.99872 4.16602M4.16532 9.99933L9.99872 15.8327" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {__("Назад")}
                            </NavLink>
                            <h1 className="side__title">{__(`Конструктор сборок`)}</h1>
                            <div className="build__data-block">
                                <p className="build__label">{__("Название")}</p>
                                <label htmlFor="title" className="input-both">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder={__('Название')}
                                        value={title}
                                        onChange={(e: React.FormEvent<HTMLInputElement>) => {setTitle(e.currentTarget.value)}}
                                    />
                                </label>
                            </div>
                            <div className="build__data-block">
                                <p className="build__label">{__("Общая информация")}</p>
                                <div className="build__grid-row">
                                    <StateSelect
                                            options={Object.values(GameVersions).map((ver: IGameVersionObject) => ({text: ver.name, value: ver.id}))}
                                            setValue={(val) => {
                                                setGameVersion(val)
                                                setIsGameVersionSelectActive(false)
                                            }}
                                            text={__(GameVersions[gameVersion].name || 'Выберите игру')}
                                            activeControlled={{
                                                isActive: isGameVersionSelectActive,
                                                clickFunction: () => {
                                                    setIsGameVersionSelectActive(!isGameVersionSelectActive)
                                                    setIsWeaponSelectActive(false)
                                                    setIsWeaponTypeSelectActive(false)
                                                    proceedAttachmentSelects()
                                                },
                                            }}
                                    />
                                    <StateSelect
                                        options={weaponTypes.map(type => ({text: _f(type, 'title'), value: type}))}
                                        setValue={(val) => {
                                            setWeaponType(val)
                                            setIsWeaponTypeSelectActive(false)
                                        }}
                                        text={_f(weaponType, 'title') || __("Тип оружия")}
                                        activeControlled={{
                                            isActive: isWeaponTypeSelectActive,
                                            clickFunction: () => {
                                                setIsGameVersionSelectActive(false)
                                                setIsWeaponSelectActive(false)
                                                setIsWeaponTypeSelectActive(!isWeaponTypeSelectActive)
                                                proceedAttachmentSelects()
                                            },
                                        }}
                                    />
                                    <StateSelect
                                        options={weapons.map(weapon => ({text: _f(weapon, 'title'), value: weapon}))}
                                        setValue={(val) => {
                                            setWeapon(val)
                                            setIsWeaponSelectActive(false)
                                        }}
                                        text={_f(weapon, 'title') || __("Оружие")}
                                        activeControlled={{
                                            isActive: isWeaponSelectActive,
                                            clickFunction: () => {
                                                setIsGameVersionSelectActive(false)
                                                setIsWeaponSelectActive(!isWeaponSelectActive)
                                                setIsWeaponTypeSelectActive(false)
                                                proceedAttachmentSelects()
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            {!!weapon && <div className="build__data-block">
                                <p className="build__label">{__("Обвесы")}</p>
                                {attachments.map((attachment, index) => (<div className="build__grid-row" key={index}>
                                    <StateSelect
                                        options={filterAttachmentTypes(availableAttachmentTypes).map((type) => ({
                                            text: _f(type, 'title'),
                                            value: type
                                        }))}
                                        setValue={(value) => setAttachmentItem(index, 'attachmentType', value)}
                                        text={_f(attachment.attachmentType, 'title') || __('Тип обвеса')}
                                        activeControlled={{
                                            isActive: attachment.isTypeActive,
                                            clickFunction: () => {
                                                setIsGameVersionSelectActive(false)
                                                setIsWeaponSelectActive(false)
                                                setIsWeaponTypeSelectActive(false)
                                                proceedAttachmentSelects(index, 'type', !attachment.isTypeActive)
                                            },
                                        }}
                                    />
                                    <StateSelect
                                        options={attachment.availableAttachments.map(weapon => ({text: _f(weapon, 'title'), value: weapon}))}
                                        setValue={(value) => setAttachmentItem(index, 'attachment', value)}
                                        text={_f(attachment.attachment, 'title') || __('Обвес')}
                                        activeControlled={{
                                            isActive: attachment.isAttachmentActive,
                                            clickFunction: () => {
                                                setIsGameVersionSelectActive(false)
                                                setIsWeaponSelectActive(false)
                                                setIsWeaponTypeSelectActive(false)
                                                proceedAttachmentSelects(index, 'attachment', !attachment.isAttachmentActive)
                                            },
                                        }}
                                    />
                                    {attachment.attachment && attachment.attachment.isNumerable && <div className="build__grid-row" style={{padding: 0}}>
                                        <label htmlFor="range_V" className="input-tl">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                <path d="M7.16797 15L10.5013 18.3334M10.5013 18.3334L13.8346 15M10.5013 18.3334V1.66669M7.16797 5.00002L10.5013 1.66669M10.5013 1.66669L13.8346 5.00002" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <input
                                                style={{width: '100%'}}
                                                type="number"
                                                name="range_V"
                                                placeholder={__("0.00")}
                                                onChange={e => setAttachmentItem(index,'range', [e.target.value, attachment.range[1]])}
                                                value={attachment.range[0] || 0}
                                            />
                                        </label>
                                        <label htmlFor="title_H" className="input-br">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                <path d="M15.5013 6.66669L18.8346 10M18.8346 10L15.5013 13.3334M18.8346 10H2.16797M5.5013 6.66669L2.16797 10M2.16797 10L5.5013 13.3334" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <input
                                                style={{width: '100%'}}
                                                type="number"
                                                name="range_H"
                                                placeholder={__("0.00")}
                                                onChange={e => setAttachmentItem(index,'range', [attachment.range[0], e.target.value])}
                                                value={attachment.range[1] || 0}
                                            />
                                        </label>
                                    </div>}
                                </div>))}
                                {attachments.length < MAX_ATTACHMENTS && <div className="build__publish-wrapper">
                                    <button className="build__publish button-both-gray"
                                            onClick={addAttachment}>{__("Добавить обвес")}</button>
                                </div>}
                            </div>}
                            { messageOptions.text && <div className={`${messageOptions.status}-message mb24`}>{__(messageOptions.text)}</div>}
                            <div className="build__publish-wrapper">
                                <button className="build__publish button-both-accent" onClick={createHandler}>{__("опубликовать сборку")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MetaBuildCreatePage;
