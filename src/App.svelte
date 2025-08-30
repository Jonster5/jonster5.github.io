<script lang="ts">
    import LockScreen from "./lib/LockScreen.svelte";
    import ViewerScreen from "./lib/ViewerScreen.svelte";
    import Viewer from "./lib/ViewerScreen.svelte";

    let page_state = $state<"lock" | "viewer">("lock");

    function enterPassword(password_input: string) {
        if (password_input === "grumpy") {
            page_state = "viewer";
        }
    }
</script>

{#if page_state === "lock"}
    <LockScreen {enterPassword}></LockScreen>
{:else if page_state === "viewer"}
    <ViewerScreen></ViewerScreen>
{:else}
    <h1>I broke something my bad</h1>
{/if}

<style>
</style>
