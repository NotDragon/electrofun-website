import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const selectedKit = url.searchParams.get('kit');
  const { user, supabase } = locals;
  
  try {
    // Load kits
    const { data: kits, error: kitsError } = await supabase
      .from('kits')
      .select('*')
      .order('level', { ascending: true });
    
    if (kitsError) throw kitsError;

    // Load user's purchased kits if logged in
    let userKits: string[] = [];
    if (user) {
      const { data: userPermissions } = await supabase
        .from('user_permissions')
        .select('kit_id')
        .eq('user_id', user.id)
        .eq('permission_type', 'course_access');
      
      userKits = (userPermissions || []).map(p => p.kit_id);
    }

    // Load official courses (only for kits user has access to)
    let officialCourses: any[] = [];
    
    if (selectedKit) {
      const { data, error } = await supabase
        .from('official_courses')
        .select('*')
        .eq('is_published', true)
        .eq('kit_id', selectedKit)
        .order('level', { ascending: true });
      
      if (error) throw error;
      officialCourses = data || [];
    } else if (userKits.length > 0) {
      // Filter to only show courses for kits the user owns
      const { data, error } = await supabase
        .from('official_courses')
        .select('*')
        .eq('is_published', true)
        .in('kit_id', userKits)
        .order('level', { ascending: true });
      
      if (error) throw error;
      officialCourses = data || [];
    } else {
      // If user has no kits, return empty array
      officialCourses = [];
    }

    // Load custom courses (only for kits user has access to)
    let customCourses: any[] = [];
    
    if (selectedKit) {
      const { data, error } = await supabase
        .from('custom_courses')
        .select(`*`)
        .eq('is_published', true)
        .eq('is_public', true)
        .eq('kit_id', selectedKit)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      customCourses = data || [];
    } else if (userKits.length > 0) {
      // Filter to only show courses for kits the user owns
      const { data, error } = await supabase
        .from('custom_courses')
        .select(`*`)
        .eq('is_published', true)
        .eq('is_public', true)
        .in('kit_id', userKits)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      customCourses = data || [];
    } else {
      // If user has no kits, return empty array
      customCourses = [];
    }

    return {
      kits: kits || [],
      officialCourses: officialCourses || [],
      customCourses: customCourses || [],
      selectedKit,
      userKits,
      error: null
    };

  } catch (error) {
    console.error('Failed to load courses:', error);
    return {
      kits: [],
      officialCourses: [],
      customCourses: [],
      selectedKit,
      userKits: [],
      error: 'Failed to load courses'
    };
  }
}; 