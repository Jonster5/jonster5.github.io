<script lang="ts">
	import { myHashFunction } from "./content";
	import { PLACEHOLDER_TEXT } from "./static";

	interface Props {
		keytest: number[];
		passwordSuccess: (key: number) => void;
	}

	const { passwordSuccess, keytest }: Props = $props();

	let password_input = $state<string>("");
	let hash = $derived(myHashFunction(password_input));
	let title_text = $state<string>("Hello!");

	function tryPassword(): boolean {
		const test_string = keytest
			.map((b) => b ^ hash)
			.map((c) => String.fromCodePoint(c))
			.join("");

		return test_string === "sunshine";
	}

	function onkeydown(ev: KeyboardEvent) {
		if (ev.key != "Enter") {
			return;
		}
		if (tryPassword()) {
			passwordSuccess(hash);
		} else {
			flashIncorrect();
			clearInput();
		}
	}

	function onclick(ev: MouseEvent) {
		if (tryPassword()) {
			passwordSuccess(hash);
		} else {
			flashIncorrect();
			clearInput();
		}
	}

	function clearInput() {
		password_input = "";
	}

	function flashIncorrect() {
		title_text = "Nuh uh, try again";
		setTimeout(() => {
			title_text = "Hello!";
		}, 2000);
	}
</script>

<main>
	<h1>{title_text}</h1>

	<input type="password" name="password" placeholder={PLACEHOLDER_TEXT} bind:value={password_input} {onkeydown} />
	<button {onclick}>Enter</button>
</main>

<style>
	main {
		display: flex;
		width: 100lvw;
		height: 100lvh;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	h1 {
		margin-bottom: 50%;
	}

	input {
		width: 80%;
		height: 32px;
	}

	button {
		width: 80%;
		height: 42px;
		background-color: #f9f9f9;
	}
</style>
