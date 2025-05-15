import { z } from "zod";

export const AddMemberSchema = z.object({
    community: z.string(),
    user: z.string(),
    role: z.string()
});

export type MemberData = z.infer<typeof AddMemberSchema>;