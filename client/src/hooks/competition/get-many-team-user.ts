import { useCallback, useEffect, useState } from "react";
import { CompetitionTable, Team, IUser } from "../../StoreTypes";
import { useTypedHttp } from "../http.hook";

export function useGetManyUsersTeams( s: string, type: CompetitionTable["type"], fetchEmpty: boolean = false ) {
    const [ data, setData ] = useState<(IUser | Team)[]>( [] );
    const { request: requestUsers, loading: loadingUsers } = useTypedHttp<{ rows: IUser[] }>();
    const { request: requestTeams, loading: loadingTeams } = useTypedHttp<{ rows: Team[] }>();

    const fetchData = useCallback( async () => {
        if ( type === "user" ) {
            const fetchedData = await requestUsers( `/api/user?s=${ s }` );
            setData( fetchedData.rows );
        }
        if ( type === "team" ) {
            const fetchedData = await requestTeams( `/api/team/search?s=${ s }` );
            setData( fetchedData.rows );
        }
    }, [ requestTeams, requestUsers, s, type ] );

    useEffect( () => {
        if ( fetchEmpty || s ) {
            fetchData().catch();
        }
    }, [ s, fetchEmpty, type ] );

    return { data, loading: loadingUsers || loadingTeams, setData };
}
