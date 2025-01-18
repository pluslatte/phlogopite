import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { api as misskeyApi } from 'misskey-js';
import type { User } from "misskey-js/entities.js";

export const load: PageServerLoad = ({ params, cookies }) => {
    if (!params.username || !params.host) {
        error(404, 'Not found');
    }

    const server = cookies.get('server');
    const token = cookies.get('token');

    return {
        username: params.username,
        host: params.host,
        cookies: {
            server: server,
            token: token
        }
    };
}