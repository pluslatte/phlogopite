import { fail, redirect, type Actions } from "@sveltejs/kit";
import { v4 as uuidv4 } from 'uuid';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const server = data.get('server');
        const callbackUrl = data.get('clientUrl') + `?host=${server}`;

        if (!server || !callbackUrl) {
            return fail(400, { message: "invalid" })
        }

        const sessionId = uuidv4();
        const permissions = "read:account,write:notes,read:channels"
        const authUrl = `https://${server}/miauth/${sessionId}?name=phlogopite&callback=${callbackUrl}&permission=${permissions}`;

        // cookies.set("server", server.toString(), {
        //     path: "/",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     maxAge: 60 * 60 * 24 * 7
        // });

        redirect(303, authUrl);
        return { success: true };
    }
};