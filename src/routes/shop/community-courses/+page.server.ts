import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { user, supabase } = locals;
  
  try {
    // Load community courses that are available for purchase
    const { data: communityCourses, error: coursesError } = await supabase
      .from('custom_courses')
      .select(`
        *,
        kits:kit_id (
          id,
          name,
          theme,
          level,
          image_url
        )
      `)
      .eq('is_published', true)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (coursesError) throw coursesError;

    // Load user's purchased kits if logged in
    let userKits: string[] = [];
    if (user) {
      const { data: userPermissions } = await supabase
        .from('user_permissions')
        .select('kit_id, permission_type, expires_at')
        .eq('user_id', user.id)
        .eq('permission_type', 'course_access');
      
      userKits = (userPermissions || []).map(p => p.kit_id);
    }

    return {
      communityCourses: communityCourses || [],
      userKits,
      error: null
    };

  } catch (error) {
    console.error('Failed to load community courses:', error);
    return {
      communityCourses: [],
      userKits: [],
      error: 'Failed to load community courses'
    };
  }
};

export const actions: Actions = {
  purchaseKit: async ({ request, locals }) => {
    const { user, supabase } = locals;
    
    if (!user) {
      return { success: false, error: 'Please log in to purchase kits' };
    }

    try {
      const formData = await request.formData();
      const kitId = formData.get('kitId') as string;
      
      if (!kitId) {
        return { success: false, error: 'Kit ID is required' };
      }

      // Grant permission to the user for this kit
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: user.id,
          kit_id: kitId,
          permission_type: 'course_access',
          expires_at: null // No expiration for now
        });

      if (error) {
        console.error('Failed to grant kit permission:', error);
        return { success: false, error: 'Failed to purchase kit' };
      }

      // Record the purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          kit_id: kitId,
          amount: 0, // Free via admin purchase
          currency: 'USD',
          payment_method: 'admin_grant',
          payment_status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Failed to record purchase:', purchaseError);
        // Don't fail the purchase if recording fails
      }

      return { success: true, message: 'Kit purchased successfully!' };
    } catch (error) {
      console.error('Purchase error:', error);
      return { success: false, error: 'Failed to process purchase' };
    }
  }
}; 