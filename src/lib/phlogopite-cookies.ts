export type PhlogopiteCookies = {
    server: string;
    token: string;
}

export function MakePhlogopiteCookiesData(server: string, token: string): PhlogopiteCookies {
    return {
        server,
        token,
    }
}