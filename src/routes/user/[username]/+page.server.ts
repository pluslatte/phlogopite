import { error } from "@sveltejs/kit";
import { MakePhlogopiteCookiesData } from "@/phlogopite-cookies";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies, params }) => {
    const server = cookies.get('server');
    const token = cookies.get('token');

    if (!server || !token) {
        error(400, 'Bad request');
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token),
        username: params.username,
    };
}