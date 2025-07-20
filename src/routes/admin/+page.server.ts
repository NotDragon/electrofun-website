import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const { user, supabase } = locals;
    
    // Get user profile and check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
    
    const isAdmin = profile?.role === 'admin';

    // Redirect if not admin
    if (!user || !isAdmin) {
        throw redirect(302, '/');
    }

    try {
        // Load all official courses
        const { data: courses, error: coursesError } = await supabase
            .from('official_courses')
            .select(`
                *,
                kit:kits(name, theme, level)
            `)
            .order('created_at', { ascending: false });

        if (coursesError) throw coursesError;

        // Load all kits for course creation
        const { data: kits, error: kitsError } = await supabase
            .from('kits')
            .select('*')
            .order('level', { ascending: true });

        if (kitsError) throw kitsError;

        return {
            courses: courses || [],
            kits: kits || [],
            error: null
        };

    } catch (error) {
        console.error('Failed to load admin data:', error);
        return {
            courses: [],
            kits: [],
            error: 'Failed to load admin data'
        };
    }
};

export const actions: Actions = {
    createCourse: async ({ request, locals }) => {
        const { user, supabase } = locals;
        
        // Check admin permissions
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
        
        if (!user || profile?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        try {
            const formData = await request.formData();
            const title = formData.get('title') as string;
            const description = formData.get('description') as string;
            const kit_id = formData.get('kit_id') as string;
            const level = parseInt(formData.get('level') as string);
            const theme = formData.get('theme') as string;
            const estimated_duration = formData.get('estimated_duration') ? 
                parseInt(formData.get('estimated_duration') as string) : null;

            const { data, error } = await supabase
                .from('official_courses')
                .insert({
                    title,
                    description,
                    kit_id,
                    level,
                    theme,
                    estimated_duration,
                    is_published: false // Start as draft
                })
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, courseId: data.id };
        } catch (error) {
            console.error('Failed to create course:', error);
            return { success: false, error: 'Failed to create course' };
        }
    },

    toggleCoursePublish: async ({ request, locals }) => {
        const { user, supabase } = locals;
        
        // Check admin permissions
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
        
        if (!user || profile?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        try {
            const formData = await request.formData();
            const courseId = formData.get('courseId') as string;
            const isPublished = formData.get('isPublished') === 'true';

            const { error } = await supabase
                .from('official_courses')
                .update({ is_published: isPublished })
                .eq('id', courseId);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to toggle course publish:', error);
            return { success: false, error: 'Failed to update course' };
        }
    }
}; 