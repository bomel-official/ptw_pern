export interface SessionState {
    token: string | null;
    userId: number | null;
    nickname: string | null;
    role: string | null;
}

export interface SessionCredentials {
    token: string;
    userId: number | null;
    nickname: string | null;
    role: string | null;
}
