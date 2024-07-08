import { useCallback, useEffect, useState } from "react";
import { ITournament } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";

export function useGetOneTournament( slug: string | undefined ) {
    const [ data, setData ] = useState<ITournament | null>( null );
    const { request, loading } = useTypedHttp<{ tournament: ITournament | null }>();

    const fetchData = useCallback( async () => {
        const fetchedData = await request( `/api/tournament/${ slug }` );
        setData( fetchedData.tournament );
    }, [ request, slug ] );

    useEffect( () => {
        if ( slug ) {
            fetchData().catch();
        }
    }, [ slug ] );

    return { data, loading, setData };
}
