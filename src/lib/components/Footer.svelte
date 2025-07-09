<script>
	import NavBar from './NavBar.svelte';

	let { style = '' } = $props();
</script>

<div class=" sticky right-0 bottom-0 left-0 flex flex-shrink-0 items-center justify-center" {style}>
	<NavBar />
</div>
