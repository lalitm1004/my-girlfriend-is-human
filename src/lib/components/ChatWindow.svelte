<script lang="ts">
    import { GameStateStore } from "$lib/stores/GameStateStore";
</script>

<div class={`h-full w-full border-2 border-neutral-800 rounded-md`}>
    <ol>
        {#if $GameStateStore}
            {#each $GameStateStore.messageHistory as msg}
                <li>{msg.role}: {msg.content}</li>
            {/each}
        {/if}
    </ol>
</div>
