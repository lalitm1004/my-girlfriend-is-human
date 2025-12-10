<script lang="ts">
	import "$lib/styles/app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { onMount } from "svelte";
	import { IsGameOver } from "$lib/stores/GameStateStore";

	let { children } = $props();

	onMount(() => {
		IsGameOver.subscribe((value) => {
			if (value) {
				alert("Game Over Twin");
			}
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
