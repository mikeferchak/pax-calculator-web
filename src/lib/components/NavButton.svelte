<script>
	import { page } from '$app/state';

	let { icon: IconComponent, label, href } = $props();

	let isActive = $derived(page.url.pathname === href);

	let activeClasses = '';
</script>

<a
	{href}
	class={`flex flex-col items-center justify-center gap-2 rounded-md hover:bg-gray-100 ${isActive ? activeClasses : ''} `}
>
	<IconComponent size="24" />
	<span class="text-xs uppercase">{label} </span>
</a>
