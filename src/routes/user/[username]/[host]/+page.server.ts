import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
    return {
        username: params.username,
        host: params.host,
    };
}