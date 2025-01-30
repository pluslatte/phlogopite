import { MakePhlogopiteCookiesData } from "@/phlogopite-cookies";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ cookies, params }) => {
    const server = cookies.get("server");
    const token = cookies.get("token");

    if (!server || !token) {
        return { status: 400 };
    }

    return {
        cookies: MakePhlogopiteCookiesData(server, token),
        noteId: params.noteId,
    };
}