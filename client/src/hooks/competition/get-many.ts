import { useCallback, useEffect, useState } from "react";
import { CompetitionRequestTypeId } from "../../data/competition";
import { Competition } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";
import { ResponseData } from "../types";

export function useGetManyCompetition( type: CompetitionRequestTypeId ) {
    const [ data, setData ] = useState<Competition[]>( [] );
    const { request, loading } = useTypedHttp<ResponseData<Competition[]>>();

    const fetchData = useCallback( async () => {
        const fetchedData = await request( `/api/competition/many?type=${ type }` );
        setData( fetchedData.data );
    }, [ request, type ] );

    useEffect( () => {
        if ( type ) {
            fetchData().catch();
        }
    }, [ type ] );

    return { data, loading, setData };
}
