import { z } from "zod"

const RoleEnum = z.enum(['Community Admin', 'Community Member']);
export type RoleName = z.infer<typeof RoleEnum>;

export const roleSchema = z.object({
    name: RoleEnum
});

export type roleInputType = z.infer<typeof roleSchema>;
