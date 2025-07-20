<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faGear,
		faArrowRightFromBracket,
		faTerminal,
		faInfo,
		faUser
	} from '@fortawesome/free-solid-svg-icons';

    import { getCurrentTheme, getColors } from '$lib/colors';

	let showMenu = $state(false);

    const { user } = $props();
    
    const { loggedIn, avatar_url, full_name, email, role } = user;

	onMount(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!(e.target as HTMLElement).closest('.user-container')) {
				showMenu = false;
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});

	function login() {
		goto('/login');
	}

	async function logout() {
		await supabase.auth.signOut();
		goto('/login');
	}

	function toggleMenu() {
		showMenu = !showMenu;
	}
</script>

<div class="user-container">
	{#if loggedIn}
		<img
			src={avatar_url ?? '/default-profile.png'}
			alt="Profile"
			class="profile-icon"
			onclick={toggleMenu}
		/>

		{#if showMenu}
			<div class="dropdown-menu">
				<div class="user-name">
					{full_name ?? email}
					<br />
					<span style="font-size: 0.75rem;">{role}</span>
				</div>
				<hr style="margin: 0.4rem 1rem;" />

				<div class="dropdown-item" onclick={() => goto('/profile')}>
					<FontAwesomeIcon icon={faUser} /> View Profile
				</div>
				<div class="dropdown-item" onclick={() => goto('/settings')}>
					<FontAwesomeIcon icon={faGear} /> Settings
				</div>

				{#if role === 'admin'}
					<div class="dropdown-item" onclick={() => goto('/admin')}>
						<FontAwesomeIcon icon={faTerminal} /> Admin Dashboard
					</div>
				{/if}

				<div class="dropdown-item" onclick={() => goto('/support')}>
					<FontAwesomeIcon icon={faInfo} /> Help/Support
				</div>
				<div class="dropdown-item" onclick={logout}>
					<FontAwesomeIcon icon={faArrowRightFromBracket} /> Log Out
				</div>
			</div>
		{/if}
	{:else}
		<button
			onclick={login}
			class="login-button"
		>
			Log in
		</button>
	{/if}
</div>

<style>
	.user-container {
		position: relative;
		display: inline-block;
	}

	.profile-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--border);
		cursor: pointer;
		object-fit: cover;
	}

	.login-button {
		padding: 6px 12px;
		font-size: 14px;
		background-color: var(--primary-color);
		border: 1px solid var(--border);
		border-radius: 4px;
		cursor: pointer;
		border: none;
		color: white;
		aspect-ratio: 17/9;
		width: 5vw;
	}

	.dropdown-menu {
		position: absolute;
		top: 45px;
		right: 0;
		background-color: var(--surface);
		border-radius: 7px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		z-index: 100;
		width: 15vw;
		padding-top: 4px;
		color: var(--text);
		font-size: 1rem;
		border: 1px solid var(--border);
	}

	.user-name {
		padding: 8px 16px;
		font-weight: bold;
	}

	.dropdown-item {
		padding: 10px 16px;
		cursor: pointer;
		transition: all 300ms ease;
	}

	.dropdown-item:last-child {
		padding-bottom: 0.9rem;
	}

	.dropdown-item:hover {
		background-color: var(--secondary-background);
		color: var(--text);
	}
</style>