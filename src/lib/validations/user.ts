// src/lib/validations/user.ts
import { z } from "zod";

export const userRoleEnum = z.enum(["student", "editor", "admin"]);
export const userStatusEnum = z.enum(["active", "suspended", "disabled"]);

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
