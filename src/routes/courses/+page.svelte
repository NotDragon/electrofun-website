// src/routes/courses/+page.svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Kit, OfficialCourse, CustomCourse } from '$lib/types/courses';
  
  const { data } = $props();
  const { kits, officialCourses, customCourses, selectedKit, userKits, error } = data;
  
  // Ensure userKits is typed as string array
  const userKitIds: string[] = userKits || [];
  
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
  {:else if userKitIds.length === 0}
    <div class="no-access">
      <h2>No Kit Access</h2>
      <p>You need to purchase a kit to access courses. Visit our shop to get started!</p>
      <a href="/shop" class="button">Go to Shop</a>
    </div>
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
        {#if userKitIds.includes(kit.id)}
          <button 
            class="filter-btn" 
            class:active={selectedKit === kit.id}
            on:click={() => filterByKit(kit.id)}
          >
            {kit.name} (Level {kit.level})
          </button>
        {/if}
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
      <p class="section-description">
        Discover courses created by the Electrofun community. 
        <a href="/shop">Browse more community courses in our shop</a>.
      </p>
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
              <a href="/courses/community/{course.id}" class="button">View Course</a>
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
    border: 1px solid var(--border-primary);
    border-radius: 20px;
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .filter-btn.active {
    background: var(--brand-primary);
    color: var(--text-inverse);
    border-color: var(--brand-primary);
  }
  
  .courses-section {
    margin-bottom: 3rem;
  }
  
  .courses-section h2 {
    color: var(--brand-primary);
    margin-bottom: 1rem;
  }
  
  .section-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
  
  .section-description a {
    color: var(--brand-primary);
    text-decoration: none;
  }
  
  .section-description a:hover {
    text-decoration: underline;
  }
  
  .no-courses {
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
    padding: 2rem;
  }
  
  .no-access {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--bg-tertiary);
    border-radius: 12px;
    margin: 2rem 0;
  }
  
  .no-access h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .no-access p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .course-card {
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s;
  }
  
  .course-card:hover {
    box-shadow: var(--shadow-md);
  }
  
  .course-card.official {
    border-left: 4px solid var(--brand-primary);
  }
  
  .course-card.custom {
    border-left: 4px solid var(--success-500);
  }
  
  .course-card h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
  }
  
  .course-card p {
    color: var(--text-secondary);
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
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: 12px;
  }
  
  .price {
    font-weight: bold;
    color: var(--brand-primary);
  }
  
  .price.free {
    color: var(--success-500);
  }
  
  .button {
    display: inline-block;
    padding: 8px 16px;
    background: var(--brand-primary);
    color: var(--text-inverse);
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s;
  }
  
  .button:hover {
    background: var(--primary-600);
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    color: var(--error-600);
    background: var(--error-50);
    border-radius: 4px;
  }
</style>