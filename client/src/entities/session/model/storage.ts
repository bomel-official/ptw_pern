import jwt_decode from "jwt-decode";
import { SessionState } from "./types";

/**
 * localStorage key holding the raw JWT. Kept as "userData" for backward
 * compatibility with the pre-refactor auth flow so existing sessions survive.
 */
export const SESSION_STORAGE_KEY = "userData";

interface DecodedToken {
    id?: number;
    nickname?: string;
    role?: string;
    exp?: number;
}

function decode(token: string): DecodedToken | null {
    try {
        return jwt_decode<DecodedToken>(token);
    } catch {
        return null;
    }
}

const EMPTY: SessionState = { token: null, userId: null, nickname: null, role: null };

/** Build a session state from a raw token (or an empty session when invalid). */
export function sessionFromToken(token: string | null): SessionState {
    if (!token) {
        return { ...EMPTY };
    }
    const decoded = decode(token);
    if (!decoded || (decoded.exp !== undefined && decoded.exp * 1000 <= Date.now())) {
        return { ...EMPTY };
    }
    return {
        token,
        userId: decoded.id ?? null,
        nickname: decoded.nickname ?? null,
        role: decoded.role ?? null,
    };
}

/** Read the persisted session for store preloadedState. */
export function loadSession(): SessionState {
    const token = localStorage.getItem(SESSION_STORAGE_KEY);
    return sessionFromToken(token);
}

export function persistToken(token: string | null): void {
    if (token) {
        localStorage.setItem(SESSION_STORAGE_KEY, token);
    } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }
}
