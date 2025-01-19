import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies }) => {
    const server = cookies.get("server");
    const token = cookies.get("token");

    return {
        cookies: {
            server: server,
            token: token,
        }
    };
};