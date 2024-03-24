import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {Header} from "../components/base/Header";
import {GameTabs} from "../components/base/GameTabs";
import {SideMenu} from "../components/base/SideMenu";
import {sideMenuItems} from "../data/Links";
import SideMobileMenu from "../components/base/SideMobileMenu";
import {__, _f} from "../multilang/Multilang";
import {Footer} from "../components/base/Footer";
import {BuildTypes, IBuildType} from "../data/BuildTypes";
import {useDebounce} from "../hooks/debounce.hook";
import MetaBuildTablet from "../components/metaBuilds/MetaBuildTablet";
import {NavLink} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import MetaBuildList from "../components/metaBuilds/MetaBuildList";
import {IBuildWeapon, IBuildWeaponType} from "../StoreTypes";
import {useHttp} from "../hooks/http.hook";
import StateSelect from "../components/base/StateSelect";


const MetaBuildsPage = () => {
    const [buildType, setBuildType] = useState<IBuildType>('admin')
    const auth = useContext(AuthContext)

    const [searchString, setSearchString] = useState<string>('')
    const debouncedString = useDebounce(searchString)

    const {request} = useHttp()

    const [types, setTypes] = useState<IBuildWeaponType[]>([])
    const [searchType, setSearchType] = useState<IBuildWeaponType | null>(null)

    const [weapons, setWeapons] = useState<IBuildWeapon[]>([])
    const [searchWeapon, setSearchWeapon] = useState<IBuildWeapon | null>(null)

    const fetchWeaponTypes = async () => {
        const {items} = await request(`/api/build/admin/weapon-type/get-all`, 'GET') as {items: IBuildWeaponType[]}
        setTypes(items)
    }
    const fetchWeapons = async (weaponType?: IBuildWeaponType | null) => {
        const {items} = await request(`/api/build/admin/weapon/get-all${weaponType ? `?buildWeaponTypeId=${weaponType.id}` : ''}`, 'GET') as {items: IBuildWeapon[]}
        setWeapons(items)
    }

    useEffect(() => {
        fetchWeapons(searchType).catch()
    }, [searchType])

    useEffect(() => {
        fetchWeaponTypes().catch()
        fetchWeapons().catch()
    }, [])

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{__(`Мета-сборки`)}</h1>
                            { auth.isAuthenticated && <div className="tournament__sidebar-block flex mb12 flex-mb-column build__block">
                                <h2 className="side__subtitle build__subheading">{__(`Выбирайте мета-сборки или составляйте свои и делитесь ими с игроками на нашей платформе.`)}</h2>
                                <NavLink to="/builds/create"
                                         className="button-both-accent corner-margin build__create-button">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.99935 4.16669V15.8334M4.16602 10H15.8327" stroke="white"
                                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>{__('Создать сборку')}</span>
                                </NavLink>
                            </div>}
                            <div className="side__tab-headings">
                                { Object.entries(BuildTypes).map(([currentBuildTypeId, currentBuildType], index) => (
                                    (currentBuildTypeId !== 'own' || auth.isAuthenticated) && <button
                                        key={index}
                                        className={buildType === currentBuildType.id ? "side__tab-heading active": "side__tab-heading"}
                                        onClick={() => setBuildType(currentBuildType.id)}
                                    >
                                        {__(currentBuildType.name)}
                                    </button>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container">
                            <div className="build__grid-row mb24">
                                <label htmlFor="build__search" className="build__search input-tl">
                                    <input
                                        type="text"
                                        name="s"
                                        placeholder={__('Поиск по сборкам')}
                                        className="build__search-input"
                                        value={searchString}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </label>
                                <StateSelect
                                    options={
                                        searchType ?
                                            [{value: null, text: __('Очистить')}, ...types.map((item) => ({value: item, text: _f(item, 'title')}))] :
                                            types.map((item) => ({value: item, text: _f(item, 'title')}))
                                    }
                                    setValue={setSearchType}
                                    text={searchType ? _f(searchType, 'title') : __('Тип оружия')}
                                />
                                <StateSelect
                                    options={
                                        searchWeapon ?
                                            [{value: null, text: __('Очистить')}, ...weapons.map((item) => ({value: item, text: _f(item, 'title')}))] :
                                            weapons.map((item) => ({value: item, text: _f(item, 'title')}))
                                    }
                                    setValue={setSearchWeapon}
                                    text={searchWeapon ? _f(searchWeapon, 'title') : __('Оружие')}
                                />
                            </div>
                            <MetaBuildList weapon={searchWeapon} weaponType={searchType} s={debouncedString} userId={(auth.user && auth.isAuthenticated && buildType === 'own') ? auth.user.id : ''} buildType={buildType}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MetaBuildsPage;