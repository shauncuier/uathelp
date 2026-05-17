// src/lib/validations/post.ts
import { z } from "zod";

export const blogCategoryEnum = z.enum([
  "tips", "guide", "routine", "strategy", "subject-guide", "news",
]);

export const blogStatusEnum = z.enum(["draft", "published", "archived"]);

export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(10, "Content is required"),
  category: blogCategoryEnum,
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().nullable(),
  status: blogStatusEnum.default("draft"),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostFormInput = z.input<typeof createPostSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
