import { z } from "zod";

export const GameStateSchema = z.object({
    currentSequenceNumber: z.number(),
    delayMs: z.number().nullable(),
    messageHistory: z.array(z.object({
        sequenceNumber: z.number(),
        role: z.enum(['log', 'human', 'ai']),
        content: z.string(),
    })),
    files: z.array(z.object({
        sequenceNumber: z.number(),
        name: z.string(),
        content: z.string(),
    })),
});
export type GameState = z.infer<typeof GameStateSchema>;