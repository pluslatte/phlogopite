import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();

        const server = data.get('server');
        const token = data.get('token');
        if (token && server) {
            cookies.set("token", token.toString(), {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });
            cookies.set("server", server.toString(), {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });
            redirect(307, "/");
        }
    }
};