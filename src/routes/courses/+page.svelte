// src/routes/courses/+page.svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Kit, OfficialCourse, CustomCourse } from '$lib/types/courses';
  
  const { data } = $props();
  const { kits, officialCourses, customCourses, selectedKit, error } = data;
  
  function filterByKit(kitId: string | null) {
    const url = new URL(window.location.href);
    if (kitId) {
      url.searchParams.set('kit', kitId);
    } else {
      url.searchParams.delete('kit');
    }
    goto(url.toString());
  }
</script>

<div class="courses-page">
  <h1>Electrofun Courses</h1>
  
  {#if error}
    <div class="error">{error}</div>
  {:else}
    <!-- Kit Filter -->
    <div class="kit-filter">
      <button 
        class="filter-btn" 
        class:active={selectedKit === null}
        on:click={() => filterByKit(null)}
      >
        All Kits
      </button>
      {#each kits as kit}
        <button 
          class="filter-btn" 
          class:active={selectedKit === kit.id}
          on:click={() => filterByKit(kit.id)}
        >
          {kit.name} (Level {kit.level})
        </button>
      {/each}
    </div>
    
    <!-- Official Courses -->
    <section class="courses-section">
      <h2>Official Courses</h2>
      {#if officialCourses.length === 0}
        <p class="no-courses">No official courses available for the selected kit.</p>
      {:else}
        <div class="courses-grid">
          {#each officialCourses as course}
            <div class="course-card official">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div class="meta">
                <span class="theme">{course.theme}</span>
                <span class="level">Level {course.level}</span>
                {#if course.estimated_duration}
                  <span class="duration">{course.estimated_duration} min</span>
                {/if}
              </div>
              <a href="/courses/official/{course.id}" class="button">Start Course</a>
            </div>
          {/each}
        </div>
      {/if}
    </section>
    
    <!-- Custom Courses -->
    <section class="courses-section">
      <h2>Community Courses</h2>
      {#if customCourses.length === 0}
        <p class="no-courses">No community courses available for the selected kit.</p>
      {:else}
        <div class="courses-grid">
          {#each customCourses as course}
            <div class="course-card custom">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div class="meta">
                <span class="creator">By {course.creator?.full_name || course.creator?.email || 'Unknown'}</span>
                {#if course.price > 0}
                  <span class="price">${course.price}</span>
                {:else}
                  <span class="price free">Free</span>
                {/if}
              </div>
              <a href="/courses/custom/{course.id}" class="button">View Course</a>
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .courses-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .kit-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .filter-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .filter-btn.active {
    background: #e96b00;
    color: white;
    border-color: #e96b00;
  }
  
  .courses-section {
    margin-bottom: 3rem;
  }
  
  .courses-section h2 {
    color: #e96b00;
    margin-bottom: 1.5rem;
  }
  
  .no-courses {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .course-card {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s;
  }
  
  .course-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .course-card.official {
    border-left: 4px solid #e96b00;
  }
  
  .course-card.custom {
    border-left: 4px solid #4CAF50;
  }
  
  .course-card h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  .course-card p {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .meta {
    display: flex;
    gap: 10px;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #666;
    flex-wrap: wrap;
  }
  
  .theme, .level, .duration, .creator {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .price {
    font-weight: bold;
    color: #e96b00;
  }
  
  .price.free {
    color: #4CAF50;
  }
  
  .button {
    display: inline-block;
    padding: 8px 16px;
    background: #e96b00;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s;
  }
  
  .button:hover {
    background: #d55f00;
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    color: #f44336;
    background: #ffebee;
    border-radius: 4px;
  }
</style>