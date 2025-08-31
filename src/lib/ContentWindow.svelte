<script lang="ts">
	import { fetchContentFile, type SunshineReport } from "./content";

	type Props = {
		key: number;
		report: SunshineReport;
	};

	const { key, report }: Props = $props();

	const content_file = fetchContentFile(report, key);
</script>

{#await content_file}
	<h3>fetching content and decrypting...</h3>
{:then content}
	<div class="text">
		{@html content}
	</div>
{/await}

<style>
	.text {
		display: block;
		box-sizing: border-box;
		width: 100%;
		height: 100%;

		padding: 12px;
	}
</style>
