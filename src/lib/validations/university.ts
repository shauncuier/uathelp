// src/lib/validations/university.ts
import { z } from "zod";
import { universityTypeEnum } from "./notice";

export const createUniversitySchema = z.object({
  nameEn: z.string().min(3, "English name is required").max(200),
  nameBn: z.string().min(2, "Bangla name is required").max(200),
  slug: z.string().optional(),
  shortName: z.string().min(1).max(50),
  type: universityTypeEnum,
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  officialWebsite: z.string().url("Must be a valid URL"),
  admissionWebsite: z.string().url("Must be a valid URL").optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  isFeatured: z.boolean().default(false),
});

export const updateUniversitySchema = createUniversitySchema.partial();

export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;
