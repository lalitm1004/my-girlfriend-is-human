import type { GameState } from "$lib/types/gameState.type";
import type { Storyline } from "$lib/types/storyline.type";

export const storylineToGameState = (
    storyline: Storyline,
    previous: GameState | null,
    currentSequenceNumber: number,
    chosenAiOptionIndex?: number
): GameState => {

    const messageHistory = previous ? [...previous.messageHistory] : [];
    const existingFiles = previous ? [...previous.files] : [];

    const previousEntry = storyline.find(e => e.sequenceNumber === currentSequenceNumber - 1);

    if (previousEntry && previousEntry.aiMessageOptions && typeof chosenAiOptionIndex === 'number') {
        const msg = previousEntry.aiMessageOptions[chosenAiOptionIndex];
        if (msg !== undefined) {
            messageHistory.push({
                sequenceNumber: previousEntry.sequenceNumber,
                role: 'ai',
                content: msg,
            });
        }
    }

    const entry = storyline.find(e => e.sequenceNumber === currentSequenceNumber);

    if (entry) {
        if (entry.humanMessage) {
            messageHistory.push({
                sequenceNumber: entry.sequenceNumber,
                role: 'human',
                content: entry.humanMessage,
            });
        }

        if (entry.logMessage) {
            messageHistory.push({
                sequenceNumber: entry.sequenceNumber,
                role: 'log',
                content: entry.logMessage,
            });
        }

        if (entry.files) {
            for (const f of entry.files) {
                const idx = existingFiles.findIndex(x => x.name === f.name);
                if (idx !== -1) {
                    existingFiles[idx] = {
                        sequenceNumber: entry.sequenceNumber,
                        name: f.name,
                        content: f.content,
                    };
                } else {
                    existingFiles.push({
                        sequenceNumber: entry.sequenceNumber,
                        name: f.name,
                        content: f.content,
                    });
                }
            }
        }
    }

    messageHistory.sort((a, b) => {
        if (a.sequenceNumber !== b.sequenceNumber) {
            return a.sequenceNumber - b.sequenceNumber;
        }
        const order = { human: 0, log: 1, ai: 2 };
        return order[a.role] - order[b.role];
    });

    existingFiles.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    const delayMs = entry && typeof entry.delayMs === 'number'
        ? entry.delayMs
        : null;

    return {
        currentSequenceNumber,
        delayMs,
        messageHistory,
        files: existingFiles,
    };
};
