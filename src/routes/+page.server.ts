
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad, PageServerLoad } from "./$types";
import { MakePhlogopiteCookiesData, type PhlogopiteCookies } from "@/phlogopite-cookies";

export const load: PageServerLoad = ({ cookies }) => {
    const server = cookies.get("server");
    const token = cookies.get("token");

    if (!server || !token) {
        redirect(307, "/auth");
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token)
    };
};