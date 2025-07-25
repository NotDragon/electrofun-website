<script>
	const year = new Date().getFullYear();
</script>

<main class="hero">
	<div class="hero-content">
		<h1>Electrofun</h1>
		<p>
			Spark Curiosity. Build the Future.<br />
			Hands-on electronics kits with interactive lessons — built for education and exploration.
		</p>
		<a href="/shop" class="button">Explore Kits</a>
	</div>
</main>

<section class="steps">
	<div class="step">
		<h3>🔧 Step 1</h3>
		<p>Pick a color-coded kit. Choose your theme & level (1–5).</p>
	</div>
	<div class="step">
		<h3>📱 Step 2</h3>
		<p>Scan the code to unlock lessons and build instructions.</p>
	</div>
	<div class="step">
		<h3>💡 Step 3</h3>
		<p>Assemble circuits and upload code to see your project come alive.</p>
	</div>
	<div class="step">
		<h3>👩‍🏫 Step 4</h3>
		<p>Learn solo or in class. Teachers can unlock lessons over time.</p>
	</div>
</section>

<section class="themes">
	<h2>🔥 Popular Kit Themes</h2>
	<div class="theme-grid">
		<div class="theme-card">
			<h3>🚀 Space Probe</h3>
			<p>Simulate real missions: sensors, data, and transmission.</p>
		</div>
		<div class="theme-card">
			<h3>🌱 Environmental Lab</h3>
			<p>Track temperature, humidity, pressure and light.</p>
		</div>
		<div class="theme-card">
			<h3>🎨 Art & Light</h3>
			<p>Create dynamic Neopixel animations and mood lamps.</p>
		</div>
	</div>
</section>

<section class="schools">
	<h2>Used in Schools Across Europe</h2>
	<p>Electrofun kits come with teacher tools, classroom progress tracking, and editable content.</p>
	<a href="/schools" class="button dark">For Schools & Educators</a>
</section>

<footer>
	<p>&copy; {year} Michalis Chatzitofi. All rights reserved.</p>
</footer>

<style>
	main.hero {
		background: linear-gradient(to bottom right, var(--primary-light), var(--primary-color));
		padding: 6rem 2rem;
		text-align: center;
	}
	.hero-content h1 {
		font-size: 3rem;
		color: var(--primary-color);
		margin-bottom: 1rem;
	}
	.hero-content p {
		font-size: 1.2rem;
		color: var(--text);
		margin-bottom: 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}
	.button {
		background-color: var(--primary-color);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		text-decoration: none;
		font-weight: bold;
		transition: background 0.3s;
	}
	.button:hover {
		background-color: var(--primary-dark);
	}

	section.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		padding: 4rem 2rem;
		background: var(--background);
		text-align: center;
	}
	.step h3 {
		margin-bottom: 0.5rem;
		font-size: 1.2rem;
		color: var(--text);
	}
	.step p {
		font-size: 0.95rem;
		color: var(--muted);
	}

	section.themes {
		background: var(--secondary-background);
		padding: 4rem 2rem;
		text-align: center;
	}
	.themes h2 {
		font-size: 2rem;
		color: var(--primary-color);
		margin-bottom: 2rem;
	}
	.theme-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
	}
	.theme-card {
		background: var(--surface);
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}
	.theme-card h3 {
		margin-bottom: 0.5rem;
		color: var(--text);
	}
	.theme-card p {
		color: var(--muted);
		font-size: 0.95rem;
	}

	section.schools {
		background: var(--accent);
		padding: 4rem 2rem;
		text-align: center;
	}
	.schools h2 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
		color: var(--text);
	}
	.schools p {
		font-size: 1rem;
		color: var(--muted);
		margin-bottom: 1.5rem;
	}
	.button.dark {
		background-color: var(--text);
		color: var(--accent);
	}
	.button.dark:hover {
		background-color: var(--muted);
	}

	footer {
		background: var(--text);
		color: var(--background);
		text-align: center;
		padding: 2rem 1rem;
		font-size: 0.9rem;
	}
</style>
