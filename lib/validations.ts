import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

// Profile schemas
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
  avatar_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number')
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .nullable(),
});

// University schemas
export const createUniversitySchema = z.object({
  name: z
    .string()
    .min(2, 'University name must be at least 2 characters')
    .max(200, 'University name must be less than 200 characters'),
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  location: z
    .string()
    .min(2, 'Location is required'),
  established_year: z
    .number()
    .int()
    .min(1800, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .nullable(),
  admission_email: z
    .string()
    .email('Invalid email address')
    .optional()
    .nullable(),
  phone: z
    .string()
    .optional()
    .nullable(),
  image_url: z
    .string()
    .url('Invalid image URL')
    .optional()
    .nullable(),
  total_students: z
    .number()
    .int()
    .positive('Total students must be positive')
    .optional()
    .nullable(),
  acceptance_rate: z
    .number()
    .min(0, 'Acceptance rate must be between 0 and 100')
    .max(100, 'Acceptance rate must be between 0 and 100')
    .optional()
    .nullable(),
  is_public: z.boolean().default(true),
});

export const updateUniversitySchema = createUniversitySchema.partial();

// Blog schemas
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters'),
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must be less than 500 characters'),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be less than 50000 characters'),
  featured_image: z
    .string()
    .url('Invalid image URL')
    .optional()
    .nullable(),
  is_published: z.boolean().default(false),
  tags: z
    .array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
});

export const updateBlogSchema = createBlogSchema.partial();

// Chat schemas
export const createChatMessageSchema = z.object({
  conversationId: z
    .string()
    .uuid('Invalid conversation ID'),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
});

export const createConversationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional()
    .nullable(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .positive('Page must be positive')
    .default(1),
  limit: z
    .number()
    .int()
    .positive('Limit must be positive')
    .max(100, 'Limit must be 100 or less')
    .default(10),
  search: z
    .string()
    .optional()
    .nullable(),
  sortBy: z
    .string()
    .optional()
    .nullable(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

// Admin user management schema
export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['student', 'moderator', 'admin', 'super_admin']),
});

export const blockUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z
    .string()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .nullable(),
});

// Filter schemas
export const universityFilterSchema = z.object({
  location: z.string().optional(),
  established_after: z.number().int().optional(),
  established_before: z.number().int().optional(),
  min_students: z.number().int().optional(),
  max_students: z.number().int().optional(),
  min_acceptance_rate: z.number().optional(),
  max_acceptance_rate: z.number().optional(),
  search: z.string().optional(),
});

// Type exports for use in components
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UniversityFilter = z.infer<typeof universityFilterSchema>;
