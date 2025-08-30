<script lang="ts">
    import {PLACEHOLDER_TEXT} from "../static";

    interface Props {
        enterPassword: (password: string) => void;
    };

    const { enterPassword }: Props = $props();

    let password_input = $state<string>("");

    function onkeydown(ev: KeyboardEvent) {
        if (ev.key != 'Enter') {
            return;
        }

        enterPassword(password_input);
        clearInput();
    }

    function onclick(ev: MouseEvent) {
        enterPassword(password_input);
        clearInput();
    }

    function clearInput() {
        password_input = "";
    }
</script>

<input type="text" placeholder={PLACEHOLDER_TEXT} bind:value={password_input} onkeydown={onkeydown}>
<button onclick={onclick}>Enter</button>

