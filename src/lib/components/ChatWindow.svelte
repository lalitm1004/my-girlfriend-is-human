<script lang="ts">
    import { GameStateStore } from "$lib/stores/GameStateStore";
    import type { GameState } from "$lib/types/gameState.type";
    import { onMount } from "svelte";

    let listElement: HTMLOListElement;

    let messageHistory = $state<GameState["messageHistory"]>([]);

    onMount(() => {
        const unsubscribe = GameStateStore.subscribe((val) => {
            if (val) {
                messageHistory = val.messageHistory;
            }
        });

        return unsubscribe;
    });

    $effect(() => {
        if (messageHistory && listElement) {
            listElement.scrollTo({
                top: listElement.scrollHeight,
                behavior: "smooth",
            });
        }
    });
</script>

<ol
    bind:this={listElement}
    class={`h-full w-full flex flex-col gap-2 p-2 border-2 border-pink-300 rounded-md overflow-y-scroll`}
>
    {#if $GameStateStore}
        {#each $GameStateStore.messageHistory as msg}
            <li
                class={`w-full flex ${
                    msg.role === "ai"
                        ? "justify-end"
                        : msg.role === "human"
                          ? "justify-start"
                          : "justify-center"
                }`}
            >
                {#if msg.role === "ai"}
                    <p class={`bg-neutral-700 p-4 rounded-md`}>
                        {msg.content}
                    </p>
                {:else if msg.role == "human"}
                    <p class={`bg-pink-300/50 p-4 rounded-md`}>
                        {msg.content}
                    </p>
                {:else}
                    <p class={`bg-blue-900/30 p-4 rounded-md text-center`}>
                        {msg.content}
                    </p>
                {/if}
            </li>
        {/each}
    {/if}
</ol>
