import {createApi, EndpointBuilder, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ITournament} from "../../StoreTypes";
import {getTournamentBySlug} from "./tournament.api";

export const playToWinApi = createApi({
    reducerPath: 'playtowin/api',
    baseQuery: fetchBaseQuery({
        baseUrl: (process.env.REACT_APP_SERVER_URL || "http://localhost:7000") + "/api"
    }),
    refetchOnFocus: true,
    endpoints: (build) => ({
        getTournamentBySlug: build.query<ITournament, string>(getTournamentBySlug),
    }),
})


export const {
    useGetTournamentBySlugQuery
} = playToWinApi