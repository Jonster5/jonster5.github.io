<script lang="ts">
    import { getContent } from "./content";

    const url =
        "https://raw.githubusercontent.com/Jonster5/sunshine-content/refs/heads/main/text.md";
</script>

<header>view header</header>
<main>
    {#await getContent(url) then html}
        {@html html}
    {/await}
</main>
