import { z } from "zod";

export const StorylineEntrySchema = z.object({
    sequenceNumber: z.number(),
    humanMessage: z.string().optional(),
    aiMessageOptions: z.array(z.string()).optional(),
    logMessage: z.string().optional(),
    delayMs: z.number().optional(),
    files: z.array(z.object({
        name: z.string(),
        content: z.string(),
    })).optional(),
});
export type StorylineEntry = z.infer<typeof StorylineEntrySchema>;


export const StorylineSchema = z.array(StorylineEntrySchema);
export type Storyline = z.infer<typeof StorylineSchema>;