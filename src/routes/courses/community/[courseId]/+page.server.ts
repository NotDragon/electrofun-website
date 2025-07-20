import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { courseId } = params;
  const { user, supabase } = locals;

  try {
    // Load community course
    const { data: course, error: courseError } = await supabase
      .from('custom_courses')
      .select(`
        *,
        creator:profiles(full_name, email)
      `)
      .eq('id', courseId)
      .eq('is_published', true)
      .eq('is_public', true)
      .single();

    if (courseError || !course) {
      throw redirect(302, '/shop');
    }

    // Check if user has access to the kit
    if (!user) {
      throw redirect(302, '/login');
    }

    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('kit_id', course.kit_id)
      .eq('permission_type', 'course_access')
      .single();

    if (!userPermissions) {
      throw redirect(302, '/shop');
    }

    // Load lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('course_type', 'custom')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (lessonsError) throw lessonsError;

    // Load user progress
    const { data: userProgress } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('course_type', 'custom');

    return {
      course,
      lessons: lessons || [],
      userProgress: userProgress || [],
      error: null
    };

  } catch (error) {
    console.error('Failed to load community course:', error);
    if (error instanceof Response) {
      throw error; // Re-throw redirects
    }
    throw redirect(302, '/shop');
  }
}; 