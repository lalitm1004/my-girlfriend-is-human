<script lang="ts">
    import getStoryline from "$lib/data/getStoryline";
    import { GameStateStore, IsGameOver } from "$lib/stores/GameStateStore";
    import type { GameState } from "$lib/types/gameState.type";
    import sleep from "$lib/utils/sleep";
    import { storylineToGameState } from "$lib/utils/storylineToGameState";
    import { onMount } from "svelte";
    import { Button } from "bits-ui";

    const storyline = getStoryline()!;

    let currentGameState = $state<GameState | null>(null);
    let currentAiOptions = $state<string[]>([]);

    onMount(() => {
        const unsubscribe = GameStateStore.subscribe((value) => {
            currentGameState = value;
            console.log(currentGameState);
        });

        return unsubscribe;
    });

    $effect(() => {
        if (currentGameState === null) {
            progressGameplay(100);
        }
    });

    const progressGameplay = async (
        sequenceNumber: number,
        chosenOptionIndex?: number,
    ) => {
        const entry = storyline.find(
            (e) => e.sequenceNumber === sequenceNumber,
        );
        if (!entry) {
            IsGameOver.set(true);
            return;
        }

        const previousState = currentGameState;
        const newState = storylineToGameState(
            storyline,
            previousState,
            sequenceNumber,
            chosenOptionIndex,
        );

        // Set state FIRST
        GameStateStore.set(newState);

        // Then do delay if needed
        if (newState.delayMs !== null && newState.delayMs > 0) {
            await sleep(newState.delayMs);
        }

        // After delay, handle what comes next
        handleAfterDelay(sequenceNumber, chosenOptionIndex);
    };

    const handleAfterDelay = (
        sequenceNumber: number,
        chosenOptionIndex?: number,
    ) => {
        const entry = storyline.find(
            (e) => e.sequenceNumber === sequenceNumber,
        );

        if (!entry) {
            IsGameOver.set(true);
            return;
        }

        if (entry.isTerminalEntry) {
            IsGameOver.set(true);
            return;
        }

        // If this was an AI response (choice was made), progress to next sequence
        if (typeof chosenOptionIndex === "number" && entry.aiMessageOptions) {
            let nextSeq = sequenceNumber + 1;
            if (
                entry.aiMessageOptionsNextSequenceNumbers &&
                entry.aiMessageOptionsNextSequenceNumbers[chosenOptionIndex] !==
                    undefined
            ) {
                nextSeq =
                    entry.aiMessageOptionsNextSequenceNumbers[
                        chosenOptionIndex
                    ];
            } else if (typeof entry.nextSequenceNumber === "number") {
                nextSeq = entry.nextSequenceNumber;
            }

            // Clear AI options and progress to next sequence
            currentAiOptions = [];
            progressGameplay(nextSeq);
        }
        // If this was a normal entry with AI options, show them
        else if (entry.aiMessageOptions && entry.aiMessageOptions.length > 0) {
            currentAiOptions = entry.aiMessageOptions;
        }
        // If this was a normal entry without AI options, auto-progress
        else {
            let nextSeq = sequenceNumber + 1;
            if (typeof entry.nextSequenceNumber === "number") {
                nextSeq = entry.nextSequenceNumber;
            }
            progressGameplay(nextSeq);
        }
    };

    const handleOptionClick = (optionIndex: number) => {
        if (!currentGameState) return;

        const { currentSequenceNumber } = currentGameState;
        const entry = storyline.find(
            (e) => e.sequenceNumber === currentSequenceNumber,
        );

        if (!entry?.aiMessageOptions) return;

        // Show the AI response at the CURRENT sequence
        progressGameplay(currentSequenceNumber, optionIndex);
        currentAiOptions = [];
    };
</script>

<div class={`h-full w-full p-2 border-2 border-pink-300 rounded-md`}>
    {#if currentAiOptions.length > 0}
        <div class={`flex flex-col gap-2`}>
            <p class={`text-3xl`}>Choose your response:</p>

            <div class={`flex flex-col gap-2`}>
                {#each currentAiOptions as option, index}
                    <Button.Root
                        class={`p-2 hover:bg-pink-100/50 border-2 border-pink-300 rounded-md transition-colors duration-200 cursor-pointer`}
                        onclick={() => handleOptionClick(index)}
                    >
                        {option}
                    </Button.Root>
                {/each}
            </div>
        </div>
    {/if}
</div>
