// src/routes/courses/official/[courseId]/+page.svelte
<script lang="ts">
  import type { OfficialCourse, Lesson, UserProgress } from '$lib/types/courses';
  
  const { data } = $props();
  const { course, lessons, userProgress, error } = data;
  
  function getLessonProgress(lessonId: string): UserProgress | undefined {
    return userProgress.find(p => p.lesson_id === lessonId);
  }
  
  function getProgressPercentage(): number {
    if (lessons.length === 0) return 0;
    const completed = userProgress.filter(p => p.status === 'completed').length;
    return Math.round((completed / lessons.length) * 100);
  }
</script>

<div class="course-page">
  {#if error}
    <div class="error">{error}</div>
  {:else if course}
    <div class="course-header">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      
      <div class="course-meta">
        <span class="theme">{course.theme}</span>
        <span class="level">Level {course.level}</span>
        {#if course.estimated_duration}
          <span class="duration">{course.estimated_duration} minutes</span>
        {/if}
      </div>
      
      {#if userProgress.length > 0}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {getProgressPercentage()}%"></div>
          <span class="progress-text">{getProgressPercentage()}% Complete</span>
        </div>
      {/if}
    </div>
    
    <div class="lessons-list">
      <h2>Lessons</h2>
      {#if lessons.length === 0}
        <p class="no-lessons">No lessons available for this course yet.</p>
      {:else}
        {#each lessons as lesson, index}
          <div class="lesson-item">
            <div class="lesson-info">
              <span class="lesson-number">{index + 1}</span>
              <div class="lesson-details">
                <h3>{lesson.title}</h3>
                {#if lesson.estimated_duration}
                  <span class="duration">{lesson.estimated_duration} min</span>
                {/if}
              </div>
            </div>
            
            <div class="lesson-status">
              {#if getLessonProgress(lesson.id)}
                {#if getLessonProgress(lesson.id)?.status === 'completed'}
                  <span class="status completed">✓ Completed</span>
                {:else}
                  <span class="status in-progress">In Progress</span>
                {/if}
              {:else}
                <span class="status not-started">Not Started</span>
              {/if}
            </div>
            
            <a href="/courses/official/{course.id}/lessons/{lesson.id}" class="lesson-link">
              {#if getLessonProgress(lesson.id)?.status === 'completed'}
                Review
              {:else}
                Start
              {/if}
            </a>
          </div>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="error">Course not found</div>
  {/if}
</div>

<style>
  .course-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .course-header {
    margin-bottom: 3rem;
  }
  
  .course-header h1 {
    color: #e96b00;
    margin-bottom: 1rem;
  }
  
  .course-header p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .course-meta {
    display: flex;
    gap: 10px;
    margin: 1rem 0;
  }
  
  .theme, .level, .duration {
    background: #f5f5f5;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.9rem;
  }
  
  .progress-bar {
    background: #f0f0f0;
    border-radius: 20px;
    height: 20px;
    position: relative;
    margin: 1rem 0;
  }
  
  .progress-fill {
    background: #4CAF50;
    height: 100%;
    border-radius: 20px;
    transition: width 0.3s;
  }
  
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    color: #333;
  }
  
  .lessons-list {
    margin-top: 2rem;
  }
  
  .lessons-list h2 {
    color: #e96b00;
    margin-bottom: 1.5rem;
  }
  
  .no-lessons {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
  }
  
  .lesson-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 1rem;
    transition: all 0.3s;
  }
  
  .lesson-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .lesson-info {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .lesson-number {
    background: #e96b00;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
  }
  
  .lesson-details h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .lesson-status {
    margin: 0 1rem;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  .status.completed {
    background: #4CAF50;
    color: white;
  }
  
  .status.in-progress {
    background: #FF9800;
    color: white;
  }
  
  .status.not-started {
    background: #f0f0f0;
    color: #666;
  }
  
  .lesson-link {
    padding: 6px 12px;
    background: #e96b00;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: background 0.3s;
  }
  
  .lesson-link:hover {
    background: #d55f00;
  }
  
  .error {
    text-align: center;
    padding: 3rem;
    color: #f44336;
    background: #ffebee;
    border-radius: 4px;
  }
</style>