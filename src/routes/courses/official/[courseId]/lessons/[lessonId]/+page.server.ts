import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { courseId, lessonId } = params;
  const { user, supabase } = locals;

  try {
    // Load lesson
    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lessonData) {
      return {
        lesson: null,
        userProgress: null,
        lessonContent: null,
        error: 'Lesson not found'
      };
    }

    // Parse lesson content
    let lessonContent = null;
    if (lessonData.content_type === 'svelte' && lessonData.svelte_component) {
      lessonContent = {
        type: 'svelte',
        svelteComponent: lessonData.svelte_component,
        componentProps: lessonData.component_props || {}
      };
    } else if (lessonData.content) {
      try {
        lessonContent = JSON.parse(lessonData.content);
      } catch (parseError) {
        console.error('Failed to parse lesson content:', parseError);
        lessonContent = null;
      }
    }

    // Load user progress if user is logged in
    let userProgress = null;
    if (user) {
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      userProgress = progressData;
    }

    return {
      lesson: lessonData,
      userProgress,
      lessonContent,
      error: null
    };

  } catch (error) {
    console.error('Failed to load lesson:', error);
    return {
      lesson: null,
      userProgress: null,
      lessonContent: null,
      error: 'Failed to load lesson'
    };
  }
};

export const actions: Actions = {
  markComplete: async ({ request, params, locals }) => {
    const { user, supabase } = locals;
    const { courseId, lessonId } = params;

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          course_type: 'official',
          status: 'completed',
          completed_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
      return { success: false, error: 'Failed to update progress' };
    }
  }
}; 