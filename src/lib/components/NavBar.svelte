<script>
	import { ArrowRightLeft, List, Settings } from 'lucide-svelte';
	import NavButton from './NavButton.svelte';
</script>

<div class="glass m-4 flex items-center justify-center gap-12 rounded-full px-8 py-2">
	<NavButton icon={ArrowRightLeft} label="Compare" href="/compare" />
	<NavButton icon={List} label="List" href="/list" />
	<NavButton icon={Settings} label="Settings" href="/settings" />
</div>
