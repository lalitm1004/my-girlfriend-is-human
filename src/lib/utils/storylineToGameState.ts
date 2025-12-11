import type { GameState } from "$lib/types/gameState.type";
import type { Storyline } from "$lib/types/storyline.type";

export const storylineToGameState = (
    storyline: Storyline,
    previous: GameState | null,
    currentSequenceNumber: number,
    chosenAiOptionIndex?: number
): GameState => {

    const messageHistory = previous ? [...previous.messageHistory] : [];
    // Files are no longer accumulated. They are replaced by the current entry's files.
    let currentFiles: GameState['files'] = [];

    const visitedSequenceNumbers = previous ? [...previous.visitedSequenceNumbers] : [];
    visitedSequenceNumbers.push(currentSequenceNumber);

    let previousEntry = null;
    if (previous && previous.visitedSequenceNumbers.length > 0) {
        const lastSeq = previous.visitedSequenceNumbers[previous.visitedSequenceNumbers.length - 1];
        previousEntry = storyline.find(e => e.sequenceNumber === lastSeq);
    }

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
            currentFiles = entry.files.map(f => ({
                sequenceNumber: entry.sequenceNumber,
                name: f.name,
                content: f.content,
            }));
        }
    }

    currentFiles.sort((a, b) => {
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
        files: currentFiles,
        visitedSequenceNumbers,
    };
};
