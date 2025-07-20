import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { courseId } = params;
  const { user, supabase } = locals;

  try {
    // Load course
    const { data: course, error: courseError } = await supabase
      .from('official_courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return {
        course: null,
        lessons: [],
        userProgress: [],
        error: 'Course not found'
      };
    }

    // Check if user has access to the kit
    if (!user) {
      return {
        course: null,
        lessons: [],
        userProgress: [],
        error: 'Please log in to access this course'
      };
    }

    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('kit_id', course.kit_id)
      .eq('permission_type', 'course_access')
      .single();

    if (!userPermissions) {
      return {
        course: null,
        lessons: [],
        userProgress: [],
        error: 'You need to purchase the required kit to access this course'
      };
    }

    // Load lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('course_type', 'official')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (lessonsError) throw lessonsError;

    // Load user progress if logged in
    let userProgress = [];
    if (user) {
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('course_type', 'official');

      userProgress = progressData || [];
    }

    return {
      course,
      lessons: lessons || [],
      userProgress,
      error: null
    };

  } catch (error) {
    console.error('Failed to load course:', error);
    return {
      course: null,
      lessons: [],
      userProgress: [],
      error: 'Failed to load course'
    };
  }
}; 