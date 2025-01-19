import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { MakePhlogopiteCookiesData } from "@/phlogopite-cookies";

export const load: PageServerLoad = ({ cookies }) => {
    const server = cookies.get('server');
    const token = cookies.get('token');

    if (!server || !token) {
        error(400, 'Bad request');
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token)
    };
}