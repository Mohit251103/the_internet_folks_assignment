import { z } from "zod"

export const roleSchema = z.object({
    name: z.string()
});

export type roleInputType = z.infer<typeof roleSchema>;
