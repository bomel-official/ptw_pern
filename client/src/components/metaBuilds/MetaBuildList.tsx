import React, {useCallback, useContext, useEffect, useState} from 'react';
import MetaBuildTablet from "./MetaBuildTablet";
import {IBuild, IBuildWeapon, IBuildWeaponType} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import Loader from "../base/Loader";

const MetaBuildList = ({userId, s, weaponType, weapon}: {userId?: number|string, s?: string, weaponType?: IBuildWeaponType | null, weapon?: IBuildWeapon | null}) => {
    const [builds, setBuilds] = useState<Array<IBuild>>([])

    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)

    const getBuilds = useCallback(async () => {
        let result = {items: []}
        try {
            result = await request(
                `/api/build/search?s=${s || ''}&userId=${userId}&weaponTypeId=${weaponType?.id || ''}&weaponId=${weapon?.id || ''}`,
                'GET')
        } catch (e) {}
        setBuilds(result.items)
    }, [userId, s, weaponType, weapon])

    const deleteHandler = async (buildId: number) => {
        try {
            await request('/api/build/delete', 'POST', {buildId}, {
                Authorization: `Bearer ${auth.token}`
            }, true)
            setBuilds(builds.filter(build => build.id !== buildId))
        } catch (e) {}
    }

    useEffect(() => {
        getBuilds().catch()
    }, [userId, s, weaponType, weapon])

    return (
        <ul className="build__items">
            {!loading && builds.map(build => (<MetaBuildTablet key={build.id} build={build} deleteHandler={deleteHandler}/>))}
            {loading && <Loader/>}
        </ul>
    );
};

export default MetaBuildList;