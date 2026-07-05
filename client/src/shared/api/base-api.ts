import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WithSession } from "@/entities/session";

export const API_URL =
    (process.env.REACT_APP_SERVER_URL || "http://localhost:7000") + "/api";

/**
 * Single RTK Query API for the whole app. Per-entity/feature endpoints are
 * attached via `baseApi.injectEndpoints(...)` inside their own slices, keeping
 * the data layer colocated with each domain while sharing one cache + one
 * store middleware.
 *
 * The auth token is read synchronously from the session slice on every request.
 */
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as WithSession).session.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: [
        "Tournament",
        "Participant",
        "Competition",
        "CompetitionTable",
        "User",
        "Team",
        "Build",
        "Friend",
        "Question",
    ],
    endpoints: () => ({}),
});
