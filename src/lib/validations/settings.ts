// src/lib/validations/settings.ts
import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  footerText: z.string().max(500).optional().nullable(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  maintenanceMode: z.boolean().optional(),
  noticeBanner: z.string().max(500).optional().nullable(),
  noticeBannerEnabled: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
