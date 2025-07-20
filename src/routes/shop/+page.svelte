<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import type { Kit, CustomCourse } from '$lib/types/courses';
  
  const { data, form } = $props();
  const { kits, communityCourses, userKits, error } = data;
  
  // Ensure userKits is typed as string array
  const userKitIds: string[] = userKits || [];
  
  function purchaseCommunityCourse(courseId: string) {
    // TODO: Implement payment logic
    alert(`Purchase flow for community course ${courseId} - Payment integration needed`);
  }
  
  function hasKitAccess(kitId: string): boolean {
    return userKitIds.includes(kitId);
  }
</script>

<div class="shop-page">
  <h1>Electrofun Shop</h1>
  
  {#if form?.message}
    <div class="success">{form.message}</div>
  {/if}
  
  {#if form?.error}
    <div class="error">{form.error}</div>
  {/if}
  
  {#if error}
    <div class="error">{error}</div>
  {:else}
    <!-- Kits Section -->
    <section class="shop-section">
      <h2>Available Kits</h2>
      <p>Purchase kits to unlock official courses and create your own community courses.</p>
      
      <div class="kits-grid">
        {#each kits as kit}
          <div class="kit-card">
            <div class="kit-header">
              <h3>{kit.name}</h3>
              <span class="level">Level {kit.level}</span>
            </div>
            <p class="theme">{kit.theme}</p>
            <p class="description">{kit.description}</p>
            <div class="price">${kit.price}</div>
            
            {#if hasKitAccess(kit.id)}
              <div class="owned-badge">✓ Owned</div>
            {:else}
              <form method="POST" action="?/purchaseKit" use:enhance>
                <input type="hidden" name="kitId" value={kit.id} />
                <button type="submit" class="purchase-btn">
                  Purchase Kit
                </button>
              </form>
            {/if}
          </div>
        {/each}
      </div>
    </section>
    
    <!-- Community Courses Section -->
    <section class="shop-section">
      <h2>Community Courses</h2>
      <p>Discover courses created by the Electrofun community.</p>
      
      <div class="courses-grid">
        {#each communityCourses as course}
          <div class="course-card">
            <div class="course-header">
              <h3>{course.title}</h3>
              <span class="creator">Community Course</span>
            </div>
            <p class="description">{course.description}</p>
            <div class="meta">
              {#if course.estimated_duration}
                <span class="duration">{course.estimated_duration} min</span>
              {/if}
              <span class="price">
                {#if course.price > 0}
                  ${course.price}
                {:else}
                  Free
                {/if}
              </span>
            </div>
            
            {#if hasKitAccess(course.kit_id)}
              <a href="/courses/community/{course.id}" class="access-btn">Access Course</a>
            {:else}
              <div class="kit-required">
                <p>Requires kit access</p>
                <form method="POST" action="?/purchaseKit" use:enhance style="display: inline;">
                  <input type="hidden" name="kitId" value={course.kit_id} />
                  <button type="submit" class="purchase-btn small">
                    Purchase Kit
                  </button>
                </form>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .shop-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .shop-page h1 {
    color: var(--brand-primary);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .shop-section {
    margin-bottom: 4rem;
  }
  
  .shop-section h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .shop-section p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  .kits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .kit-card, .course-card {
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s;
    position: relative;
  }
  
  .kit-card:hover, .course-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  .kit-header, .course-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .kit-header h3, .course-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.2rem;
  }
  
  .level {
    background: var(--brand-primary);
    color: var(--text-inverse);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .theme {
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: 1rem;
  }
  
  .creator {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .description {
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--brand-primary);
    margin-bottom: 1rem;
  }
  
  .meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .duration {
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: 12px;
    color: var(--text-secondary);
  }
  
  .purchase-btn {
    width: 100%;
    padding: 12px;
    background: var(--brand-primary);
    color: var(--text-inverse);
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .purchase-btn:hover {
    background: var(--primary-600);
  }
  
  .purchase-btn.small {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .owned-badge {
    background: var(--success-500);
    color: var(--text-inverse);
    padding: 8px 16px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
  }
  
  .access-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background: var(--success-500);
    color: var(--text-inverse);
    text-decoration: none;
    text-align: center;
    border-radius: 8px;
    font-weight: bold;
    transition: background 0.3s;
  }
  
  .access-btn:hover {
    background: var(--success-600);
  }
  
  .kit-required {
    text-align: center;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 8px;
  }
  
  .kit-required p {
    margin: 0 0 0.5rem 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .error {
    background: var(--error-50);
    color: var(--error-700);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .success {
    background: var(--success-50);
    color: var(--success-700);
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 2rem;
  }
</style> 