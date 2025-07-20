// src/lib/types/courses.ts
export interface Kit {
    id: string;
    name: string;
    theme: string;
    level: number;
    description: string;
    qr_code: string;
    access_code: string;
    kit_type: 'normal' | 'organization';
    price: number;
    premium_upgrade_price?: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface OfficialCourse {
    id: string;
    kit_id: string;
    title: string;
    description: string;
    theme: string;
    level: number;
    estimated_duration?: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface CustomCourse {
    id: string;
    creator_id: string;
    kit_id: string;
    title: string;
    description: string;
    is_public: boolean;
    is_published: boolean;
    price: number;
    estimated_duration?: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Lesson {
    id: string;
    course_id: string;
    course_type: 'official' | 'custom';
    title: string;
    content?: string;
    svelte_component?: string;
    component_props?: Record<string, any>;
    content_type: 'text' | 'video' | 'interactive' | 'quiz' | 'code' | 'svelte';
    order_index: number;
    estimated_duration?: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserPermissions {
    userId: string;
    kitId: string;
    permissions: {
      canAccessStandardCourse: boolean;
      canCreateCustomCourses: boolean;
    };
    expiresAt?: string;
  }
  
  export interface UserProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    course_id: string;
    course_type: 'official' | 'custom';
    status: 'not_started' | 'in_progress' | 'completed';
    completed_at?: string;
    time_spent?: number;
  }
  
  export interface LessonContent {
    type: 'text' | 'video' | 'interactive' | 'quiz' | 'code' | 'svelte';
    blocks?: ContentBlock[];
    svelteComponent?: string;
    componentProps?: Record<string, any>;
  }
  
  export interface ContentBlock {
    id: string;
    type: 'paragraph' | 'image' | 'video' | 'code_editor' | 'circuit_diagram' | 'quiz';
    content: any;
    order: number;
  }