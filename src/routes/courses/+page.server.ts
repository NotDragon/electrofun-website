import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
  const selectedKit = url.searchParams.get('kit');
  const { supabase } = locals;
  
  try {
    // Load kits
    const { data: kits, error: kitsError } = await supabase
      .from('kits')
      .select('*')
      .order('level', { ascending: true });
    
    if (kitsError) throw kitsError;

    // Load official courses
    let officialCoursesQuery = supabase
      .from('official_courses')
      .select('*')
      .eq('is_published', true);
    
    if (selectedKit) {
      officialCoursesQuery = officialCoursesQuery.eq('kit_id', selectedKit);
    }
    
    const { data: officialCourses, error: officialError } = await officialCoursesQuery
      .order('level', { ascending: true });
    
    if (officialError) throw officialError;

    // Load custom courses (public only)
    let customCoursesQuery = supabase
      .from('custom_courses')
      .select(`
        *,
        creator:creator_id(email, full_name),
        kit:kit_id(name, theme, level)
      `)
      .eq('is_published', true)
      .eq('is_public', true);
    
    if (selectedKit) {
      customCoursesQuery = customCoursesQuery.eq('kit_id', selectedKit);
    }
    
    const { data: customCourses, error: customError } = await customCoursesQuery
      .order('created_at', { ascending: false });
    
    if (customError) throw customError;

    return {
      kits: kits || [],
      officialCourses: officialCourses || [],
      customCourses: customCourses || [],
      selectedKit,
      error: null
    };

  } catch (error) {
    console.error('Failed to load courses:', error);
    return {
      kits: [],
      officialCourses: [],
      customCourses: [],
      selectedKit,
      error: 'Failed to load courses'
    };
  }
}; 