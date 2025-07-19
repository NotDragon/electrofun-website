// src/routes/login/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		const { supabase } = locals;

		const form = await request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;

		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(401, { error: error.message, email });
		}

		const session = data.session;
		if (session) {
			cookies.set('sb-access-token', session.access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				maxAge: 60 * 60 * 24 * 7
			});
		}

		// Redirect after successful login
		throw redirect(303, '/');
	}
};
