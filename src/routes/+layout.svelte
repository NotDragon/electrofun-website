<script lang="ts">
    import UserStatus from '$lib/components/UserStatus.svelte';

    const { children, data } = $props();
    const { user, profile } = data;
</script>

<main>
    
	<div style="position: fixed; top: 2rem; right: 1rem;">
        <UserStatus user={ {
            loggedIn: user !== null,
            avatar_url: user?.user_metadata.avatar_url, 
            fll_name: user?.user_metadata.full_name,
            email: user?.email,
            role: profile?.role
        } }/>
	</div>

    {@render children()}
</main>

<style>
    :global(body) {
        margin: 0;
    }
</style>