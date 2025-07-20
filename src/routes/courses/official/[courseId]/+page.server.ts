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