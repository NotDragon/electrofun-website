import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const { user, supabase } = locals;
  
  if (!user) {
    throw redirect(302, '/login');
  }

  try {
    // Load user's kits (kits they have access to)
    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('kit_id')
      .eq('user_id', user.id)
      .eq('permission_type', 'course_access');

    const userKitIds = (userPermissions || []).map(p => p.kit_id);

    // Load kits the user has access to
    const { data: kits, error: kitsError } = await supabase
      .from('kits')
      .select('*')
      .in('id', userKitIds)
      .order('level', { ascending: true });

    if (kitsError) throw kitsError;

    // Load user's existing courses
    const { data: userCourses, error: coursesError } = await supabase
      .from('custom_courses')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (coursesError) throw coursesError;

    return {
      kits: kits || [],
      userCourses: userCourses || [],
      error: null
    };

  } catch (error) {
    console.error('Failed to load create course data:', error);
    return {
      kits: [],
      userCourses: [],
      error: 'Failed to load create course data'
    };
  }
};

export const actions: Actions = {
  createCourse: async ({ request, locals }) => {
    const { user, supabase } = locals;
    
    if (!user) {
      return { success: false, error: 'Please log in to create courses' };
    }

    try {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const kitId = formData.get('kitId') as string;
      const price = parseFloat(formData.get('price') as string) || 0;
      const isPublic = formData.get('isPublic') === 'true';
      const estimatedDuration = formData.get('estimatedDuration') ? 
        parseInt(formData.get('estimatedDuration') as string) : null;

      // Validate that user has access to the selected kit
      const { data: userPermission } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('kit_id', kitId)
        .eq('permission_type', 'course_access')
        .single();

      if (!userPermission) {
        return { success: false, error: 'You do not have access to the selected kit' };
      }

      const { data: course, error } = await supabase
        .from('custom_courses')
        .insert({
          creator_id: user.id,
          kit_id: kitId,
          title,
          description,
          price,
          is_public: isPublic,
          is_published: false, // Start as draft
          estimated_duration: estimatedDuration
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, courseId: course.id, message: 'Course created successfully!' };
    } catch (error) {
      console.error('Failed to create course:', error);
      return { success: false, error: 'Failed to create course' };
    }
  },

  updateCourse: async ({ request, locals }) => {
    const { user, supabase } = locals;
    
    if (!user) {
      return { success: false, error: 'Please log in to update courses' };
    }

    try {
      const formData = await request.formData();
      const courseId = formData.get('courseId') as string;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const price = parseFloat(formData.get('price') as string) || 0;
      const isPublic = formData.get('isPublic') === 'true';
      const isPublished = formData.get('isPublished') === 'true';
      const estimatedDuration = formData.get('estimatedDuration') ? 
        parseInt(formData.get('estimatedDuration') as string) : null;

      // Verify user owns this course
      const { data: existingCourse } = await supabase
        .from('custom_courses')
        .select('*')
        .eq('id', courseId)
        .eq('creator_id', user.id)
        .single();

      if (!existingCourse) {
        return { success: false, error: 'Course not found or you do not have permission to edit it' };
      }

      const { error } = await supabase
        .from('custom_courses')
        .update({
          title,
          description,
          price,
          is_public: isPublic,
          is_published: isPublished,
          estimated_duration: estimatedDuration
        })
        .eq('id', courseId)
        .eq('creator_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Course updated successfully!' };
    } catch (error) {
      console.error('Failed to update course:', error);
      return { success: false, error: 'Failed to update course' };
    }
  }
}; 