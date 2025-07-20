// src/lib/services/courseService.ts
import { supabase } from '$lib/supabaseClient';
import type { Kit, OfficialCourse, CustomCourse, Lesson, UserPermissions, UserProgress } from '$lib/types/courses';

export class CourseService {
  // Kit Management
  async getKits(): Promise<Kit[]> {
    const { data, error } = await supabase
      .from('kits')
      .select('*')
      .order('level', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getKitById(id: string): Promise<Kit | null> {
    const { data, error } = await supabase
      .from('kits')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Official Courses
  async getOfficialCourses(kitId?: string): Promise<OfficialCourse[]> {
    let query = supabase
      .from('official_courses')
      .select('*')
      .eq('is_published', true);
    
    if (kitId) {
      query = query.eq('kit_id', kitId);
    }
    
    const { data, error } = await query.order('level', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async getOfficialCourseById(id: string): Promise<OfficialCourse | null> {
    const { data, error } = await supabase
      .from('official_courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Custom Courses
  async getCustomCourses(kitId?: string, isPublic = true): Promise<CustomCourse[]> {
    let query = supabase
      .from('custom_courses')
      .select('*')
      .eq('is_published', true);
    
    if (isPublic) {
      query = query.eq('is_public', true);
    }
    
    if (kitId) {
      query = query.eq('kit_id', kitId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createCustomCourse(courseData: Partial<CustomCourse>): Promise<CustomCourse> {
    const { data, error } = await supabase
      .from('custom_courses')
      .insert(courseData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Lessons
  async getLessons(courseId: string, courseType: 'official' | 'custom'): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('course_type', courseType)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async createLesson(lessonData: Partial<Lesson>): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // User Permissions
  async getUserPermissions(userId: string, kitId: string): Promise<UserPermissions> {
    const { data: permissions, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId)
      .eq('kit_id', kitId);
    
    if (error) throw error;
    
    return {
      userId,
      kitId,
      permissions: {
        canAccessStandardCourse: permissions.some(p => p.permission_type === 'course_access'),
        canCreateCustomCourses: permissions.some(p => p.permission_type === 'custom_course_creation')
      },
      expiresAt: permissions.find(p => p.expires_at)?.expires_at
    };
  }

  async grantPermission(userId: string, kitId: string, permissionType: string, expiresAt?: string) {
    const { error } = await supabase
      .from('user_permissions')
      .upsert({
        user_id: userId,
        kit_id: kitId,
        permission_type: permissionType,
        expires_at: expiresAt
      });
    
    if (error) throw error;
  }

  // User Progress
  async getUserProgress(userId: string, courseId: string, courseType: 'official' | 'custom'): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('course_type', courseType);
    
    if (error) throw error;
    return data || [];
  }

  async updateProgress(progressData: Partial<UserProgress>): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert(progressData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const courseService = new CourseService();
