import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { MakePhlogopiteCookiesData, type PhlogopiteCookies } from "@/phlogopite-cookies";

export const load: LayoutServerLoad = ({ cookies }) => {
    const server = cookies.get("server");
    const token = cookies.get("token");

    if (!server || !token) {
        error(400, "Bad request");
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token)
    };
};