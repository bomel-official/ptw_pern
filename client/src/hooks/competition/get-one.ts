import { useCallback, useEffect, useState } from "react";
import { Competition } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";

export function useGetOneCompetition( id: undefined | string ) {
    const [ data, setData ] = useState<Competition | null>( null );
    const { request, loading } = useTypedHttp<ResponseData<Competition | null>>();

    const fetchData = useCallback( async () => {
        const fetchedData = await request( `/api/competition?id=${ id }` );
        setData( fetchedData.data );
    }, [ request, id ] );

    useEffect( () => {
        if ( id && id !== "create" ) {
            fetchData().catch();
        }
    }, [ id ] );

    return { data, loading, setData };
}
