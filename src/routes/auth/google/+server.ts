// src/routes/auth/google/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { supabase } = locals;

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: 'http://localhost:5173/auth/callback' // replace with your real URL in prod
		}
	});

	if (error || !data?.url) {
		throw redirect(303, '/login');
	}

	throw redirect(303, data.url);
};
