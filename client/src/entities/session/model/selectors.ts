import { SessionState } from "./types";

/** Minimal root shape the session selectors depend on (avoids app<->entity cycle). */
export interface WithSession {
    session: SessionState;
}

export const selectSessionToken = (state: WithSession) => state.session.token;
export const selectUserId = (state: WithSession) => state.session.userId;
export const selectUserRole = (state: WithSession) => state.session.role;
export const selectIsAuthenticated = (state: WithSession) => Boolean(state.session.token);
