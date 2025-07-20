<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { OfficialCourse, Lesson } from '$lib/types/courses';
  
  const { data } = $props();
  const { course, lessons, error } = data;
  
  let showCreateLesson = $state(false);
  let editingLesson: Lesson | null = $state(null);
  let showDeleteConfirm = $state<string | null>(null);
  
  function createNewLesson() {
    showCreateLesson = true;
    editingLesson = null;
  }
  
  function editLesson(lesson: Lesson) {
    editingLesson = lesson;
    showCreateLesson = true;
  }
  
  function deleteLesson(lessonId: string) {
    showDeleteConfirm = lessonId;
  }
  
  function handleFormResult(result: any) {
    if (result.type === 'success') {
      showCreateLesson = false;
      editingLesson = null;
      // Refresh the page to show changes
      window.location.reload();
    }
  }
  
  function handleDeleteResult(result: any) {
    if (result.type === 'success') {
      showDeleteConfirm = null;
      // Refresh the page to show changes
      window.location.reload();
    }
  }
</script>

<div class="course-management">
  <header class="course-header">
    <div class="breadcrumb">
      <a href="/admin">← Back to Admin</a>
    </div>
    <h1>{course?.title}</h1>
    <p>{course?.description}</p>
    
    <div class="course-meta">
      <span class="kit">{course?.kit?.name}</span>
      <span class="level">Level {course?.level}</span>
      <span class="theme">{course?.theme}</span>
      <span class="status {course?.is_published ? 'published' : 'draft'}">
        {course?.is_published ? 'Published' : 'Draft'}
      </span>
    </div>
  </header>

  {#if error}
    <div class="error-message">{error}</div>
  {:else}
    <div class="management-content">
      <!-- Lessons Section -->
      <section class="lessons-section">
        <div class="section-header">
          <h2>Lessons ({lessons.length})</h2>
          <button class="create-btn" on:click={createNewLesson}>
            + Add Lesson
          </button>
        </div>

        {#if lessons.length === 0}
          <div class="empty-state">
            <p>No lessons created yet. Add your first lesson to get started!</p>
          </div>
        {:else}
          <div class="lessons-list">
            {#each lessons as lesson, index}
              <div class="lesson-card">
                <div class="lesson-info">
                  <div class="lesson-number">{index + 1}</div>
                  <div class="lesson-details">
                    <h3>{lesson.title}</h3>
                    <div class="lesson-meta">
                      <span class="content-type">{lesson.content_type}</span>
                      {#if lesson.estimated_duration}
                        <span class="duration">{lesson.estimated_duration} min</span>
                      {/if}
                      <span class="status {lesson.is_published ? 'published' : 'draft'}">
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="lesson-actions">
                  <button class="edit-btn" on:click={() => editLesson(lesson)}>
                    Edit
                  </button>
                  <button class="delete-btn" on:click={() => deleteLesson(lesson.id)}>
                    Delete
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}

  <!-- Create/Edit Lesson Modal -->
  {#if showCreateLesson}
    <div class="modal-overlay" on:click={() => showCreateLesson = false}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
          <button class="close-btn" on:click={() => showCreateLesson = false}>×</button>
        </div>
        
        <form 
          method="POST" 
          action={editingLesson ? "?/updateLesson" : "?/createLesson"}
          use:enhance={() => {
            return async ({ result }) => {
              handleFormResult(result);
            };
          }}
          enctype="multipart/form-data"
        >
          {#if editingLesson}
            <input type="hidden" name="lessonId" value={editingLesson.id} />
          {/if}
          
          <div class="form-group">
            <label for="title">Lesson Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required 
              value={editingLesson?.title || ''}
              placeholder="Enter lesson title"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="order_index">Order</label>
              <input 
                type="number" 
                id="order_index" 
                name="order_index" 
                required 
                min="1"
                value={editingLesson?.order_index || lessons.length + 1}
              />
            </div>
            
            <div class="form-group">
              <label for="estimated_duration">Duration (minutes)</label>
              <input 
                type="number" 
                id="estimated_duration" 
                name="estimated_duration" 
                min="1"
                value={editingLesson?.estimated_duration || ''}
                placeholder="30"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="content_type">Content Type</label>
            <select id="content_type" name="content_type" required>
              <option value="text" selected={editingLesson?.content_type === 'text'}>Text</option>
              <option value="video" selected={editingLesson?.content_type === 'video'}>Video</option>
              <option value="interactive" selected={editingLesson?.content_type === 'interactive'}>Interactive</option>
              <option value="quiz" selected={editingLesson?.content_type === 'quiz'}>Quiz</option>
              <option value="code" selected={editingLesson?.content_type === 'code'}>Code</option>
              <option value="svelte" selected={editingLesson?.content_type === 'svelte'}>Svelte Component</option>
            </select>
          </div>
          
          <!-- Content based on type -->
          <div class="content-section">
            {#if editingLesson?.content_type === 'svelte' || !editingLesson}
              <div class="form-group">
                <label for="svelte_file">Svelte Component File (.svelte)</label>
                <input 
                  type="file" 
                  id="svelte_file" 
                  name="svelte_file" 
                  accept=".svelte"
                  required={!editingLesson}
                />
                <small>Upload a .svelte file for interactive lessons</small>
              </div>
              
              <div class="form-group">
                <label for="component_props">Component Props (JSON)</label>
                <textarea 
                  id="component_props" 
                  name="component_props" 
                  rows="3"
                  placeholder={'"initialValue": "hello", "allowEdit": true'}
                >{editingLesson?.component_props ? JSON.stringify(editingLesson.component_props, null, 2) : ''}</textarea>
                <small>Optional JSON props to pass to the Svelte component</small>
              </div>
            {:else}
              <div class="form-group">
                <label for="content">Content</label>
                <textarea 
                  id="content" 
                  name="content" 
                  rows="6"
                  placeholder="Enter lesson content..."
                >{editingLesson?.content || ''}</textarea>
              </div>
            {/if}
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" on:click={() => showCreateLesson = false}>
              Cancel
            </button>
            <button type="submit" class="submit-btn">
              {editingLesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteConfirm}
    <div class="modal-overlay" on:click={() => showDeleteConfirm = null}>
      <div class="modal small" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Delete Lesson</h3>
          <button class="close-btn" on:click={() => showDeleteConfirm = null}>×</button>
        </div>
        
        <div class="modal-content">
          <p>Are you sure you want to delete this lesson? This action cannot be undone.</p>
        </div>
        
        <form 
          method="POST" 
          action="?/deleteLesson"
          use:enhance={() => {
            return async ({ result }) => {
              handleDeleteResult(result);
            };
          }}
        >
          <input type="hidden" name="lessonId" value={showDeleteConfirm} />
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" on:click={() => showDeleteConfirm = null}>
              Cancel
            </button>
            <button type="submit" class="delete-btn">
              Delete Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .course-management {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .course-header {
    margin-bottom: 3rem;
  }
  
  .breadcrumb {
    margin-bottom: 1rem;
  }
  
  .breadcrumb a {
    color: #e96b00;
    text-decoration: none;
  }
  
  .breadcrumb a:hover {
    text-decoration: underline;
  }
  
  .course-header h1 {
    color: #e96b00;
    margin-bottom: 0.5rem;
  }
  
  .course-header p {
    color: #666;
    margin-bottom: 1.5rem;
  }
  
  .course-meta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .kit, .level, .theme, .status {
    background: #f5f5f5;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.9rem;
  }
  
  .status.published {
    background: #4CAF50;
    color: white;
  }
  
  .status.draft {
    background: #FF9800;
    color: white;
  }
  
  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .section-header h2 {
    color: #e96b00;
    margin: 0;
  }
  
  .create-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .create-btn:hover {
    background: #45a049;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .lessons-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .lesson-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
  }
  
  .lesson-card:hover {
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
  
  .lesson-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .content-type, .duration, .status {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  .lesson-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .delete-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .edit-btn:hover {
    background: #f5f5f5;
  }
  
  .delete-btn {
    color: #f44336;
    border-color: #f44336;
  }
  
  .delete-btn:hover {
    background: #f44336;
    color: white;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal.small {
    max-width: 500px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .modal-content {
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  .form-group small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.8rem;
  }
  
  .content-section {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #f9f9f9;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  
  .cancel-btn {
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .submit-btn {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .submit-btn:hover {
    background: #45a049;
  }
</style> 