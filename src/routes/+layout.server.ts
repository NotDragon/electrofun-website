import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
    const { user } = await locals.safeGetSession();
    const { data: profile, error } = await locals.supabase.from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()


	return {
        user,
        profile
    }
};
