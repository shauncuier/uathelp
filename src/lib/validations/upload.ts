// src/lib/validations/upload.ts
import { z } from "zod";

export const uploadTypeEnum = z.enum([
  "notice-pdf",
  "notice-image",
  "university-logo",
  "blog-cover",
]);

export const uploadSchema = z.object({
  type: uploadTypeEnum,
  entityId: z.string().optional(),
});

export type UploadType = z.infer<typeof uploadTypeEnum>;
export type UploadInput = z.infer<typeof uploadSchema>;
