
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
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

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const server = data.get('server');
        const token = data.get('token');

        if (!server || !token) {
            return fail(400, { message: "invalid" })
        }

        return { success: true };
    }
};