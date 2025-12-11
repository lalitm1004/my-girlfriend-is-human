<script lang="ts">
    import getStoryline from "$lib/data/getStoryline";
    import { GameStateStore, IsGameOver } from "$lib/stores/GameStateStore";
    import type { GameState } from "$lib/types/gameState.type";
    import sleep from "$lib/utils/sleep";
    import { storylineToGameState } from "$lib/utils/storylineToGameState";
    import { onMount } from "svelte";
    import { Button } from "bits-ui";

    const storyline = getStoryline()!;
    const maxSequenceNumber = Math.max(
        ...storyline.map((e) => e.sequenceNumber),
    );

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
            progressGameplay(0);
        }

        handleGameStateUpdate();
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

        if (newState.delayMs !== null && newState.delayMs > 0) {
            await sleep(newState.delayMs);
        }

        GameStateStore.set(newState);
    };

    const handleGameStateUpdate = () => {
        if (!currentGameState) return;

        const { currentSequenceNumber } = currentGameState;
        const entry = storyline.find(
            (e) => e.sequenceNumber === currentSequenceNumber,
        );

        if (!entry) {
            // Should be handled by progressGameplay, but just in case
            return;
        }

        if (entry.isTerminalEntry) {
            IsGameOver.set(true);
            return;
        }

        if (entry.aiMessageOptions && entry.aiMessageOptions.length > 0) {
            currentAiOptions = entry.aiMessageOptions;
        } else {
            let nextSeq = currentSequenceNumber + 1;
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

        let nextSeq = currentSequenceNumber + 1;
        if (entry) {
            if (
                entry.aiMessageOptionsNextSequenceNumbers &&
                entry.aiMessageOptionsNextSequenceNumbers[optionIndex] !==
                    undefined
            ) {
                nextSeq =
                    entry.aiMessageOptionsNextSequenceNumbers[optionIndex];
            } else if (typeof entry.nextSequenceNumber === "number") {
                nextSeq = entry.nextSequenceNumber;
            }
        }

        currentAiOptions = [];
        progressGameplay(nextSeq, optionIndex);
    };
</script>

<div class={`h-full w-full p-2 border-2 border-neutral-800 rounded-md`}>
    {#if currentAiOptions.length > 0}
        <div>
            <p>Choose your repsonse:</p>
            <div class={`flex flex-col gap-2`}>
                {#each currentAiOptions as option, index}
                    <Button.Root
                        class={`border-2 border-neutral-800 rounded-md`}
                        onclick={() => handleOptionClick(index)}
                    >
                        {option}
                    </Button.Root>
                {/each}
            </div>
        </div>
    {/if}
</div>
