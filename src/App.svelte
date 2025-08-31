<script lang="ts">
	import { onMount } from "svelte";
	import LockScreen from "./lib/LockScreen.svelte";
	import ViewerScreen from "./lib/ViewerScreen.svelte";
	import Viewer from "./lib/ViewerScreen.svelte";
	import { fetchIndex } from "./lib/content";

	let page_state = $state<"lock" | "viewer">("lock");
	let key = $state<number>(0);

	function passwordSuccess(entered_key: number) {
		key = entered_key;
		page_state = "viewer";
	}
</script>

{#await fetchIndex()}
	loading...
{:then index}
	{#if page_state === "lock"}
		<LockScreen {passwordSuccess} keytest={index.keytest}></LockScreen>
	{:else if page_state === "viewer"}
		<ViewerScreen {index} {key}></ViewerScreen>
	{:else}
		<h1>I broke something my bad</h1>
	{/if}
{/await}

<style>
</style>
