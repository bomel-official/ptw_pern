import { useCallback, useEffect, useState } from "react";
import { IUser } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";

export function useGetManyUsers( s: string, fetchEmpty: boolean = false ) {
    const [ data, setData ] = useState<IUser[]>( [] );
    const { request, loading } = useTypedHttp<{ rows: IUser[] }>();

    const fetchData = useCallback( async () => {
        const fetchedData = await request( `/api/user?s=${ s }` );
        setData( fetchedData.rows );
    }, [ request, s ] );

    useEffect( () => {
        if ( fetchEmpty || s ) {
            fetchData().catch();
        }
    }, [ s, fetchEmpty ] );

    return { data, loading, setData };
}
