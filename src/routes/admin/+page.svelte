<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { OfficialCourse, Kit } from '$lib/types/courses';
  
  const { data } = $props();
  const { courses, kits, error } = data;
  
  let showCreateCourse = $state(false);
  let selectedCourse: OfficialCourse | null = $state(null);
  let showCreateLesson = $state(false);
  
  function openCourse(course: OfficialCourse) {
    selectedCourse = course;
    goto(`/admin/courses/${course.id}`);
  }
  
  function createNewCourse() {
    showCreateCourse = true;
  }
</script>

<div class="admin-dashboard">
  <header class="admin-header">
    <h1>Admin Dashboard</h1>
    <p>Manage official courses and lessons</p>
  </header>

  {#if error}
    <div class="error-message">{error}</div>
  {:else}
    <div class="dashboard-content">
      <!-- Course Management Section -->
      <section class="courses-section">
        <div class="section-header">
          <h2>Official Courses</h2>
          <div class="header-actions">
            <a href="/admin/kits" class="btn-secondary">Manage Kits</a>
            <button class="create-btn" on:click={createNewCourse}>
              + Create New Course
            </button>
          </div>
        </div>

        {#if courses.length === 0}
          <div class="empty-state">
            <p>No courses created yet. Create your first course to get started!</p>
          </div>
        {:else}
          <div class="courses-grid">
            {#each courses as course}
              <div class="course-card" on:click={() => openCourse(course)}>
                <div class="course-header">
                  <h3>{course.title}</h3>
                  <span class="status {course.is_published ? 'published' : 'draft'}">
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p>{course.description}</p>
                <div class="course-meta">
                  <span class="kit">{course.kit?.name || 'Unknown Kit'}</span>
                  <span class="level">Level {course.level}</span>
                  <span class="theme">{course.theme}</span>
                </div>
                <div class="course-actions">
                  <button class="edit-btn">Edit Course</button>
                  <button class="lessons-btn">Manage Lessons</button>
                  <form method="POST" action="?/toggleCoursePublish" style="display: inline;">
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="isPublished" value={!course.is_published} />
                    <button type="submit" class="publish-btn {course.is_published ? 'unpublish' : 'publish'}">
                      {course.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}

  <!-- Create Course Modal -->
  {#if showCreateCourse}
    <div class="modal-overlay" on:click={() => showCreateCourse = false}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Create New Course</h3>
          <button class="close-btn" on:click={() => showCreateCourse = false}>×</button>
        </div>
        
        <form 
          method="POST" 
          action="?/createCourse"
          use:enhance={() => {
            return async ({ result }) => {
              if (result.type === 'success') {
                showCreateCourse = false;
                // Refresh the page to show new course
                window.location.reload();
              }
            };
          }}
        >
          <div class="form-group">
            <label for="title">Course Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required 
              placeholder="Enter course title"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              required 
              placeholder="Enter course description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="kit_id">Kit</label>
              <select id="kit_id" name="kit_id" required>
                <option value="">Select a kit</option>
                {#each kits as kit}
                  <option value={kit.id}>
                    {kit.name} (Level {kit.level})
                  </option>
                {/each}
              </select>
            </div>
            
            <div class="form-group">
              <label for="level">Level</label>
              <select id="level" name="level" required>
                <option value="">Select level</option>
                {#each Array.from({length: 5}, (_, i) => i + 1) as level}
                  <option value={level}>Level {level}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="theme">Theme</label>
            <select id="theme" name="theme" required>
              <option value="">Select theme</option>
              <option value="space">Space</option>
              <option value="environment">Environment</option>
              <option value="art_light">Art & Light</option>
              <option value="home_tech">Home Tech</option>
              <option value="games">Games</option>
              <option value="robotics">Robotics</option>
              <option value="wearables">Wearables</option>
              <option value="retro_tech">Retro Tech</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="estimated_duration">Estimated Duration (minutes)</label>
            <input 
              type="number" 
              id="estimated_duration" 
              name="estimated_duration" 
              min="1"
              placeholder="120"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" on:click={() => showCreateCourse = false}>
              Cancel
            </button>
            <button type="submit" class="submit-btn">Create Course</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  .admin-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .admin-header {
    margin-bottom: 3rem;
    text-align: center;
  }
  
  .admin-header h1 {
    color: #e96b00;
    margin-bottom: 0.5rem;
  }
  
  .admin-header p {
    color: #666;
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
  
  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
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
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .course-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .course-header h3 {
    margin: 0;
    color: #333;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .status.published {
    background: #4CAF50;
    color: white;
  }
  
  .status.draft {
    background: #FF9800;
    color: white;
  }
  
  .course-card p {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .course-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .kit, .level, .theme {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  .course-actions {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .lessons-btn, .publish-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .edit-btn:hover, .lessons-btn:hover, .publish-btn:hover {
    background: #f5f5f5;
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
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
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