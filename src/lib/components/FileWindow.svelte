<script lang="ts">
    import { GameStateStore } from "$lib/stores/GameStateStore";
</script>

<div class={`h-full w-full border-2 border-neutral-800 rounded-md`}>
    <pre>
{JSON.stringify($GameStateStore?.files, null, 2)}
    </pre>
</div>
