import type { LayoutServerLoad } from "./$types";
import { MakePhlogopiteCookiesData } from "@/phlogopite-cookies";

export const load: LayoutServerLoad = ({ cookies }) => {
    const server = cookies.get("server");
    const token = cookies.get("token");

    if (!server || !token) {
        return;
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token)
    };
};