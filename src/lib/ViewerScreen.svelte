<script lang="ts">
	import { fetchContentFile, type SunshineIndex } from "./content";
	import ContentWindow from "./ContentWindow.svelte";

	const { index, key }: { index: SunshineIndex; key: number } = $props();

	const timestamp = new Date(index.timestamp);
</script>

<header>
	<h1>Hi Sophia!</h1>
</header>
<main>
	{#each index.reports as report}
		<ContentWindow {key} {report} />
	{/each}
</main>

<style>
	header {
		display: flex;
		width: 100vw;
		height: 48px;
		background: #fae8af;

		justify-content: center;
		align-items: center;
	}

	main {
		width: 100vw;
	}
</style>
