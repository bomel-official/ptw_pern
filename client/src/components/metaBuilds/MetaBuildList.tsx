import React, {useCallback, useEffect, useState} from 'react';
import MetaBuildTablet from "./MetaBuildTablet";
import {IBuild} from "../../StoreTypes";
import {useHttp} from "../../hooks/http.hook";

const MetaBuildList = ({userId, s}: {userId?: number|string, s?: string}) => {
    const [builds, setBuilds] = useState<Array<IBuild>>([])

    const {loading, request, error, clearError} = useHttp()

    const getBuilds = useCallback(async () => {
        let result = {items: []}
        try {
            result = await request(
                `/api/build/search?s=${s}&userId=${userId}`,
                'GET')
        } catch (e) {}
        setBuilds(result.items)
    }, [userId, s])

    useEffect(() => {
        getBuilds().catch()
    }, [userId, s])

    return (
        <ul className="build__items">
            {builds.map(build => (<MetaBuildTablet build={build}/>))}
        </ul>
    );
};

export default MetaBuildList;