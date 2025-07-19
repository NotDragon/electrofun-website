// src/routes/auth/callback/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	const { supabase } = locals;

	if (!code) {
		throw redirect(303, '/login');
	}

	// ⬇️ This is the missing step — exchange the code for a session
	const { data, error } = await supabase.auth.exchangeCodeForSession(code);

	if (error || !data?.session) {
		console.error('OAuth login failed:', error?.message);
		throw redirect(303, '/login');
	}

	cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });

	throw redirect(303, next); // redirect to homepage or originally intended page
};
