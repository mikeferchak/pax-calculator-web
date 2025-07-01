<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { onNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	// Define tab order for spatial transitions
	const tabOrder = ['/compare', '/list', '/settings'];
	
	let currentTabIndex = $state(0);
	let direction = $state('right');

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Determine direction based on tab order
		const fromPath = navigation.from?.url.pathname || '/compare';
		const toPath = navigation.to?.url.pathname || '/compare';
		
		const fromIndex = tabOrder.indexOf(fromPath);
		const toIndex = tabOrder.indexOf(toPath);
		
		// Only apply spatial transitions for known tabs
		if (fromIndex !== -1 && toIndex !== -1) {
			direction = toIndex > fromIndex ? 'right' : 'left';
			currentTabIndex = toIndex;
			
			console.log(`Transitioning from ${fromPath} (${fromIndex}) to ${toPath} (${toIndex}) - direction: ${direction}`);
		}

		return new Promise((resolve) => {
			// Set CSS custom properties for direction
			if (direction === 'right') {
				document.documentElement.style.setProperty('--slide-out-animation', 'slide-out-left');
				document.documentElement.style.setProperty('--slide-in-animation', 'slide-in-right');
			} else {
				document.documentElement.style.setProperty('--slide-out-animation', 'slide-out-right');
				document.documentElement.style.setProperty('--slide-in-animation', 'slide-in-left');
			}
			
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="relative flex h-dvh flex-col">
	<!-- <Header /> -->
	<main class="flex flex-1 flex-col" style="view-transition-name: main-content;">
		{@render children()}
	</main>
	<Footer style="view-transition-name: footer;" />
</div>
