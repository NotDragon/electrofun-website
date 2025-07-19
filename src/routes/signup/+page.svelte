<script lang="ts">
	const { form } = $props();
</script>

<div class="container">
    <form method="POST">
        <h2>Sign Up</h2>
        <input name="email" type="email" value={form?.email ?? ''} placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
        {#if form?.error}
            <p class="error">{form.error}</p>
        {/if}
    </form>
    <a href="/auth/google">
        <button type="button">Sign up with Google</button>
    </a>
    <div>
		Already have an account? <a href="/login">Log In</a>
	</div>
</div>

<style>
    form {
        width: 20vw;
		display: flex;
		flex-direction: column;
		gap: 10px;
    }
    
	.container {
		display: flex;
		justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        gap: 10px;
	}
	.error {
		color: red;
	}
</style>
