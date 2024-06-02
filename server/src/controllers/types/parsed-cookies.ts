export type ParsedCookies = { error?: boolean; } & {
    [key: string]: string | undefined;
}
