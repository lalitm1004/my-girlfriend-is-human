<script lang="ts">
    import { GameStateStore } from "$lib/stores/GameStateStore";
    import { Dialog } from "bits-ui";
</script>

<div
    class={`h-full w-full flex flex-col gap-4 p-4 border-2 border-pink-300 rounded-md`}
>
    <p class={`text-3xl font-geom font-bold`}>File Menu</p>

    <ul class={`flex flex-col gap-2`}>
        {#if $GameStateStore}
            {#each $GameStateStore.files as file}
                <li
                    class={`w-full p-2 rounded-md bg-neutral-900 hover:bg-neutral-700/40 transition-colors duration-200`}
                >
                    <Dialog.Root>
                        <Dialog.Trigger
                            class={`flex gap-2 rounded-md cursor-pointer`}
                        >
                            {@render fileSvg()}
                            {file.name}
                        </Dialog.Trigger>

                        <Dialog.Portal>
                            <Dialog.Overlay
                                class={`z-50 fixed h-dvh w-dvw inset-0 bg-neutral-950/80`}
                            />

                            <Dialog.Content
                                class={`z-50 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[75dvh] max-w-[50dvw] flex flex-col gap-4 p-4 bg-neutral-800 rounded-md`}
                            >
                                <div
                                    class={`flex justify-between items-center`}
                                >
                                    <Dialog.Title class={` text-xl`}>
                                        {file.name}
                                    </Dialog.Title>

                                    <Dialog.Close class={`cursor-pointer`}>
                                        {@render xSvg()}
                                    </Dialog.Close>
                                </div>

                                <Dialog.Description
                                    class={`h-full overflow-y-scroll font-jetbrains`}
                                >
                                    {#each file.content.split("\n") as line}
                                        {#if line === ""}
                                            <div class="h-4"></div>
                                        {:else}
                                            <pre>{line}</pre>
                                        {/if}
                                    {/each}
                                </Dialog.Description>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </li>
            {/each}
        {/if}
    </ul>
</div>

{#snippet xSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-current stroke-2 lucide lucide-x-icon lucide-x`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
{/snippet}

{#snippet fileSvg()}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class={`h-6 aspect-square fill-none stroke-current stroke-2 lucide lucide-file-text-icon lucide-file-text`}
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path
            d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
        />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
{/snippet}
