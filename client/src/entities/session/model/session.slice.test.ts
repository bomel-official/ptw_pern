import { clearSession, sessionReducer, setToken } from "./session.slice";
import { SESSION_STORAGE_KEY } from "./storage";
import { SessionState } from "./types";

/** Build an unsigned JWT whose payload decodes to the given claims. */
function makeToken(payload: Record<string, unknown>): string {
    const b64 = (obj: unknown) => btoa(JSON.stringify(obj));
    return `${b64({ alg: "none" })}.${b64(payload)}.sig`;
}

const empty: SessionState = { token: null, userId: null, nickname: null, role: null };

describe("sessionSlice", () => {
    beforeEach(() => localStorage.clear());

    it("decodes id/nickname/role from the token and persists it", () => {
        const token = makeToken({
            id: 7,
            nickname: "neo",
            role: "ADMIN",
            exp: Math.floor(Date.now() / 1000) + 3600,
        });

        const state = sessionReducer(empty, setToken(token));

        expect(state).toEqual({ token, userId: 7, nickname: "neo", role: "ADMIN" });
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe(token);
    });

    it("treats an expired token as no session", () => {
        const token = makeToken({ id: 1, exp: Math.floor(Date.now() / 1000) - 10 });
        const state = sessionReducer(empty, setToken(token));
        expect(state).toEqual(empty);
    });

    it("clearSession resets state and removes the stored token", () => {
        localStorage.setItem(SESSION_STORAGE_KEY, "x");
        const populated: SessionState = { token: "x", userId: 1, nickname: "a", role: "USER" };
        const state = sessionReducer(populated, clearSession());
        expect(state).toEqual(empty);
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });
});
