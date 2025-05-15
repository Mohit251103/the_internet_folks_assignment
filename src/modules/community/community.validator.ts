import { z } from "zod";

export const CommunityInputSchema = z.object({
    name: z.string().min(2, "Community name cannot be less than 2 characters long")
});

export type CommunityData = z.infer<typeof CommunityInputSchema>;