import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistToken, sessionFromToken } from "./storage";
import { SessionState } from "./types";

const initialState: SessionState = {
    token: null,
    userId: null,
    nickname: null,
    role: null,
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        /** Set the session from a raw JWT (decodes id/nickname/role, persists it). */
        setToken(state, action: PayloadAction<string | null>) {
            const next = sessionFromToken(action.payload);
            state.token = next.token;
            state.userId = next.userId;
            state.nickname = next.nickname;
            state.role = next.role;
            persistToken(next.token);
        },
        clearSession(state) {
            state.token = null;
            state.userId = null;
            state.nickname = null;
            state.role = null;
            persistToken(null);
        },
    },
});

export const { setToken, clearSession } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
