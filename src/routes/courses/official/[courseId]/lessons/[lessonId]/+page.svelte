// src/routes/courses/official/[courseId]/lessons/[lessonId]/+page.svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import DynamicLesson from '$lib/components/DynamicLesson.svelte';
  import type { Lesson, UserProgress } from '$lib/types/courses';
  
  const { data } = $props();
  const { lesson, userProgress, lessonContent, error } = data;
  
  let isCompleting = $state(false);
  let completionError = $state<string | null>(null);
  
  function handleMarkComplete() {
    isCompleting = true;
    completionError = null;
  }
  
  function handleMarkCompleteResult(result: any) {
    isCompleting = false;
    
    if (result.type === 'failure') {
      completionError = result.data?.error || 'Failed to mark lesson complete';
    }
  }
</script>

<div class="lesson-viewer">
  {#if error}
    <div class="error">{error}</div>
  {:else if lesson}
    <div class="lesson-header">
      <h1>{lesson.title}</h1>
      <div class="lesson-meta">
        {#if lesson.estimated_duration}
          <span class="duration">Estimated time: {lesson.estimated_duration} minutes</span>
        {/if}
        {#if userProgress?.status === 'completed'}
          <span class="completed">✓ Completed</span>
        {/if}
      </div>
    </div>
    
    <div class="lesson-content">
      {#if lessonContent}
        <DynamicLesson lessonContent={lessonContent} />
      {:else}
        <div class="no-content">No content available for this lesson.</div>
      {/if}
    </div>
    
    {#if completionError}
      <div class="error-message">{completionError}</div>
    {/if}
    
    <div class="lesson-actions">
      {#if userProgress?.status !== 'completed'}
        <form 
          method="POST" 
          action="?/markComplete"
          use:enhance={() => {
            handleMarkComplete();
            return async ({ result }) => {
              handleMarkCompleteResult({ result });
            };
          }}
        >
          <button 
            type="submit" 
            class="complete-btn" 
            disabled={isCompleting}
          >
            {isCompleting ? 'Marking Complete...' : 'Mark as Complete'}
          </button>
        </form>
      {:else}
        <button class="completed-btn" disabled>✓ Completed</button>
      {/if}
      
      <a href="/courses/official/{lesson.course_id}" class="back-btn">
        Back to Course
      </a>
    </div>
  {:else}
    <div class="error">Lesson not found</div>
  {/if}
</div>

<style>
  .lesson-viewer {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .lesson-header {
    margin-bottom: 2rem;
  }
  
  .lesson-meta {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    color: #666;
  }
  
  .duration, .completed {
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.9rem;
  }
  
  .completed {
    background: #4CAF50;
    color: white;
  }
  
  .lesson-content {
    margin-bottom: 3rem;
  }
  
  .no-content {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-style: italic;
  }
  
  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .lesson-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .complete-btn {
    padding: 12px 24px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
  }
  
  .complete-btn:hover:not(:disabled) {
    background: #45a049;
  }
  
  .complete-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .completed-btn {
    padding: 12px 24px;
    background: #ccc;
    color: #666;
    border: none;
    border-radius: 4px;
    cursor: not-allowed;
    font-size: 1rem;
  }
  
  .back-btn {
    padding: 12px 24px;
    background: #e96b00;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 1rem;
    transition: background 0.3s;
  }
  
  .back-btn:hover {
    background: #d55f00;
  }
  
  .error {
    text-align: center;
    padding: 3rem;
    color: #f44336;
  }
</style>