// src/lib/validations/notice.ts
import { z } from "zod";

export const noticeCategoryEnum = z.enum([
  "admission", "result", "seat-plan",
  "routine", "job", "scholarship", "general",
]);

export const universityTypeEnum = z.enum([
  "public", "private", "national", "medical", "engineering", "agriculture",
]);

export const noticeStatusEnum = z.enum(["draft", "published", "archived"]);

export const createNoticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().optional(),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500),
  body: z.string().min(10, "Body is required"),
  universityId: z.string().min(1, "University is required"),
  universityName: z.string().min(1, "University name is required"),
  category: noticeCategoryEnum,
  universityType: universityTypeEnum,
  unit: z.string().optional(),
  session: z.string().min(1, "Session is required"),
  applicationStart: z.string().optional().nullable(),
  applicationEnd: z.string().optional().nullable(),
  examDate: z.string().optional().nullable(),
  resultDate: z.string().optional().nullable(),
  pdfUrl: z.string().url().optional().or(z.literal("")).nullable(),
  officialUrl: z.string().url().optional().or(z.literal("")).nullable(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  status: noticeStatusEnum.default("draft"),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
