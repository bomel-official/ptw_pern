import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Header} from "../base/Header";
import {GameTabs} from "../base/GameTabs";
import {SideMenu} from "../base/SideMenu";
import {sideAdminMenuItems} from "../../data/Links";
import SideMobileMenu from "../base/SideMobileMenu";
import {__} from "../../multilang/Multilang";
import {Footer} from "../base/Footer";
import {IUser} from "../../StoreTypes";
import {useDebounce} from "../../hooks/debounce.hook";
import {useHttp} from "../../hooks/http.hook";
import AdminUserRoleTablet from "../admin/AdminUserRoleTablet";
import {AuthContext} from "../../context/AuthContext";

const AdminRoleEditorPage = () => {
    const [admins, setAdmins] = useState<Array<IUser>>([])
    const [searchList, setSearchList] = useState<Array<IUser>>([])
    const [searchString, setSearchString] = useState<string>('')
    const debouncedString = useDebounce(searchString)

    const {request} = useHttp()
    const auth = useContext(AuthContext)

    const fetchUsers = useCallback(async () => {
        const data = debouncedString.length ? await request(`/api/user/?s=${debouncedString}`, 'GET') : {rows: []}
        setSearchList(data.rows.filter((user: IUser) => user.role !== 'ADMIN'))
    }, [debouncedString])

    const fetchAdmins = useCallback(async () => {
        if (auth.token) {
            const data = await request(`/api/user/admin/get-admins/`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAdmins(data.rows)
        }
    }, [auth.token])

    useEffect(() => {
        fetchUsers().catch()
    }, [setSearchList, debouncedString])

    useEffect(() => {
        fetchAdmins().catch()
    }, [setAdmins, auth.token])

    const setRole = async (user: IUser, role: 'USER' | 'ADMIN') => {
        if (role !== user.role) {
            if (role === 'ADMIN') {
                setAdmins([...admins, {...user, role}])
                setSearchList(searchList.filter((fUser: IUser) => fUser.id !== user.id))
            }
            if (role === 'USER') {
                setAdmins(admins.filter((aUser: IUser) => aUser.id !== user.id))
            }
            const {message}: {message: string} = await request(`/api/user/admin/set-role`, 'POST', {userId: user.id, role}, {
                Authorization: `Bearer ${auth.token}`
            }, true)
        }
    }

    return (
        <div className="TournamentsPage full-height header-padding">
            <Header/>
            <GameTabs/>
            <div className="side">
                <SideMenu menu={Object.values(sideAdminMenuItems)}/>
                <div className="side__content">
                    <div className="side__content-top">
                        <div className="side__container">
                            <SideMobileMenu/>
                            <h1 className="side__title">{__(`Админ-панель: Доступ`)}</h1>
                            <h2 className="side__subtitle">{__(`На данной странице вы можете редактировать пользователей, которые имеют доступ к админ-панели`)}</h2>
                        </div>
                    </div>
                    <div className="side__content-bottom">
                        <div className="side__container pb104">
                            {auth.user && auth.user.role === 'SUPERADMIN' ? <>
                                <h2 className="profile__heading mb12">{__('Админы')}</h2>
                                <div className="profile__teams-tablet mb24">
                                    {admins.map((user) => (
                                        <AdminUserRoleTablet user={user} setRole={setRole} key={user.id}/>
                                    ))}
                                    {admins.length === 0 && <>
                                        <p className="text">{__('Пользователи не найдены')}</p>
                                    </>}
                                </div>
                                <h2 className="profile__heading mb12">{__('Поиск пользователей')}</h2>
                                <label htmlFor="nickname" className="profile__search input-tl mb12">
                                    <input
                                        type="text"
                                        name="nickname"
                                        placeholder={__('Никнейм игрока')}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
                                        value={searchString}
                                    />
                                </label>
                                <div className="profile__teams-tablet mb24">
                                    {searchList.map((user) => (
                                        <AdminUserRoleTablet user={user} setRole={setRole} key={user.id}/>
                                    ))}
                                    {searchList.length === 0 && <>
                                        <p className="text">{__('Пользователи не найдены')}</p>
                                    </>}
                                </div>
                            </> : <h2 className="side__subtitle">{__('Нет доступа...')}</h2>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminRoleEditorPage;