import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { IBuildType } from "../../data/BuildTypes";
import { useHttp } from "../../hooks/http.hook";
import { IBuild, IBuildWeapon, IBuildWeaponType } from "../../StoreTypes";
import Loader from "../base/Loader";
import MetaBuildTablet from "./MetaBuildTablet";

const MetaBuildList = ( {
                            userId, s, weaponType, weapon, buildType
                        }: { userId?: number | string, s?: string, weaponType?: IBuildWeaponType | null, weapon?: IBuildWeapon | null, buildType: IBuildType } ) => {
    const [ builds, setBuilds ] = useState<Array<IBuild>>( [] );

    const { loading, request } = useHttp();
    const auth = useContext( AuthContext );

    const getBuilds = useCallback( async () => {
        let result = { items: [] };
        try {
            result = await request(
                `/api/build/search?s=${ s || "" }&userId=${ userId }&weaponTypeId=${ weaponType?.id ||
                "" }&weaponId=${ weapon?.id || "" }&buildType=${ buildType }`,
                "GET" );
        } catch ( e ) {}
        setBuilds( result.items );
    }, [ userId, s, weaponType, weapon, buildType ] );

    const deleteHandler = async ( buildId: number ) => {
        try {
            await request( "/api/build/delete", "POST", { buildId }, {
                Authorization: `Bearer ${ auth.token }`
            }, true );
            setBuilds( builds.filter( build => build.id !== buildId ) );
        } catch ( e ) {}
    };

    const toggleIsMeta = async ( buildId: number ) => {
        try {
            const { isMeta } = await request(
                `/api/build/toggle-meta`, "POST", { buildId }, {
                    Authorization: `Bearer ${ auth.token }`
                }, true );
            setBuilds( builds.map( ( build: IBuild ) => {
                if ( build.id !== buildId ) return build;
                build.isMeta = isMeta;
                return build;
            } ) );
        } catch ( e ) {}
    };

    useEffect( () => {
        getBuilds().catch();
    }, [ userId, s, weaponType, weapon, buildType ] );

    return (
        <ul className="build__items">
            { !loading && builds.map( build => (
                <MetaBuildTablet key={ build.id } build={ build } deleteHandler={ deleteHandler }
                                 toggleIsMeta={ toggleIsMeta }/>) ) }
            { loading && <Loader/> }
        </ul>
    );
};

export default MetaBuildList;
