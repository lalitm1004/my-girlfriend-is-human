import storylineJson from "$lib/data/storyline.json";
import { StorylineSchema, type Storyline } from "$lib/types/storyline.type";

const getStoryline = (): Storyline | null => {
    const result = StorylineSchema.safeParse(storylineJson);

    if (!result.success) {
        console.error("Storyline JSON validation failed:", result.error.message);
        return null;
    }

    return result.data;
}
export default getStoryline;