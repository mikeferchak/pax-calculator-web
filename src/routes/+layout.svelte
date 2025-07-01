<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="relative flex h-dvh flex-col">
	<!-- <Header /> -->
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>
