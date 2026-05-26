// src/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// All shared TypeScript interfaces and types for UAT Help
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums / Literals ────────────────────────────────────────────────────────

export type NoticeCategory =
  | "admission"
  | "result"
  | "admit-card"
  | "seat-plan"
  | "routine"
  | "job"
  | "scholarship"
  | "general";

export type UniversityType =
  | "public"
  | "private"
  | "national"
  | "medical"
  | "engineering"
  | "agriculture";

export type NoticeStatus = "draft" | "published" | "archived";

export type VersionChangeType = "CREATE" | "UPDATE" | "RESTORE" | "DELETE_DRAFT";

export type BlogCategory =
  | "tips"
  | "guide"
  | "routine"
  | "strategy"
  | "subject-guide"
  | "news"
  | "study-tips"
  | "exam-prep"
  | "university-review"
  | "career-guidance"
  | "course-review";

export type UserRole = "student" | "editor" | "admin";
export type UserStatus = "active" | "suspended" | "disabled";

// ─── Notice ──────────────────────────────────────────────────────────────────

export interface Notice {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  universityId: string;
  universityName: string;
  category: NoticeCategory;
  universityType: UniversityType;
  unit?: string;
  session: string;
  applicationStart?: Date;
  applicationEnd?: Date;
  examDate?: Date;
  resultDate?: Date;
  pdfUrl?: string;
  officialUrl?: string;
  imageUrl?: string;
  tags: string[];
  searchKeywords: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  isApproachingDeadline?: boolean;
  deadlineReminderDays?: number;
  viewCount: number;
  status: NoticeStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
  
  // Versioning
  version: number; // Current version number (starts at 1)
  versionHistoryCount: number; // Total number of versions
}

// ─── Notice Version ───────────────────────────────────────────────────────────

export interface NoticeVersion {
  id: string;
  noticeId: string;
  versionNumber: number;
  
  // Full notice snapshot
  title: string;
  slug: string;
  summary: string;
  body: string;
  universityId: string;
  universityName: string;
  category: NoticeCategory;
  universityType: UniversityType;
  unit?: string;
  session: string;
  applicationStart?: Date;
  applicationEnd?: Date;
  examDate?: Date;
  resultDate?: Date;
  pdfUrl?: string;
  officialUrl?: string;
  imageUrl?: string;
  tags: string[];
  searchKeywords: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number;
  status: NoticeStatus;
  seoTitle?: string;
  seoDescription?: string;
  
  // Change tracking
  changeType: VersionChangeType;
  changedFields: string[]; // List of field names that changed
  changes: Record<string, { old: any; new: any }>; // Old vs new values
  changelog: string; // Human-readable change summary
  changeReason?: string; // Why the change was made (if provided)
  
  // Metadata
  createdAt: Date;
  createdBy: string; // User ID
  createdByName?: string; // User name
}

export interface University {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortName: string;
  type: UniversityType;
  division: string;
  district: string;
  officialWebsite: string;
  admissionWebsite?: string;
  logoUrl?: string;
  description?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Blog Post ────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  searchKeywords: string[];
  imageUrl?: string;
  status: "draft" | "published" | "archived";
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  savedUniversities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Saved Notice ─────────────────────────────────────────────────────────────

export interface SavedNotice {
  id: string;
  userId: string;
  noticeId: string;
  createdAt: Date;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  footerText?: string;
  seoTitle: string;
  seoDescription: string;
  allowRegistration?: boolean;
  maintenanceMode: boolean;
  noticeBanner?: string;
  noticeBannerEnabled: boolean;
  updatedAt: Date;
}

// ─── Admin Log ────────────────────────────────────────────────────────────────

export interface AdminLog {
  id: string;
  action: string;
  entityType: "notice" | "university" | "post" | "user" | "settings" | "upload";
  entityId?: string;
  entityTitle?: string;
  performedBy: string;
  performedByEmail: string;
  role: UserRole;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  total?: number;
  hasMore: boolean;
  nextCursor?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalNotices: number;
  publishedNotices: number;
  draftNotices: number;
  archivedNotices: number;
  urgentNotices: number;
  totalUniversities: number;
  totalBlogPosts: number;
  totalUsers: number;
  latestNotices: Notice[];
  latestPosts: BlogPost[];
  recentAdminLogs: AdminLog[];
  upcomingDeadlines: Notice[];
}
