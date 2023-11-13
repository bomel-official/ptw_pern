import React, {useCallback, useContext, useEffect, useState} from 'react';
import MetaBuildTablet from "./MetaBuildTablet";
import {IBuild} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";

const MetaBuildList = ({userId, s}: {userId?: number|string, s?: string}) => {
    const [builds, setBuilds] = useState<Array<IBuild>>([])

    const {loading, request, error, clearError} = useHttp()
    const auth = useContext(AuthContext)

    const getBuilds = useCallback(async () => {
        let result = {items: []}
        try {
            result = await request(
                `/api/build/search?s=${s || ''}&userId=${userId}`,
                'GET')
        } catch (e) {}
        setBuilds(result.items)
    }, [userId, s])

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
    }, [userId, s])

    return (
        <ul className="build__items">
            {builds.map(build => (<MetaBuildTablet key={build.id} build={build} deleteHandler={deleteHandler}/>))}
        </ul>
    );
};

export default MetaBuildList;