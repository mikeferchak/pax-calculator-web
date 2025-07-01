<script>
	import { page } from '$app/state';

	let { icon: IconComponent, label, href } = $props();

	let isActive = $derived(page.url.pathname === href);

	let activeClasses = 'text-[var(--color-glass-foreground-active)] drop-shadow-[0_0_8px_oklch(100%_0_0_/_0.3)]';
</script>

<a
	{href}
	class={`flex flex-col items-center justify-center gap-2 rounded-md ${isActive ? activeClasses : 'text-glass-foreground'} `}
>
	<IconComponent size="24" />
	<span class="text-xs uppercase">{label} </span>
</a>
