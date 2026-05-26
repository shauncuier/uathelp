# 🎯 UAT Help - Development Task Tracker

**Project**: UAT Help - Bangladesh Student Education Platform  
**Start Date**: May 27, 2026  
**Current Phase**: Phase 1 - Core Enhancement  
**Status**: ⏳ In Progress

---

## 📋 Phase 1: Foundation & Core Enhancement (Weeks 1-2)

### 1.1 Content Management Expansion

#### Task 1.1.1: Extend Blog/Tips Categories
**Priority**: 🔴 HIGH  
**Status**: ⏳ TODO  
**Estimated Time**: 4 hours  
**Assignee**: Open

**Description**:
Expand blog categories from current 6 to 10+ categories.

**Current Categories**:
- tips
- guide
- routine
- strategy
- subject-guide
- news

**New Categories to Add**:
- study-tips
- exam-prep
- university-review
- career-guidance
- course-review

**Subtasks**:
- [ ] Update `BlogCategory` type in `src/types/index.ts`
- [ ] Add category seed data to `scripts/seed-simple.js`
- [ ] Create category landing page component
- [ ] Update blog post form with new categories
- [ ] Create category filtering on tips page
- [ ] Update blog post seed data

**Files to Modify**:
- `src/types/index.ts`
- `src/schemas/post.ts` (if using Zod)
- `src/app/(public)/tips/page.tsx`
- `scripts/seed-simple.js`
- `src/components/blog/PostForm.tsx`

**Acceptance Criteria**:
✅ All 10 categories available in database  
✅ Blog form shows all categories  
✅ Category filtering works on tips page  
✅ Seeded posts include new categories  

---

#### Task 1.1.2: Implement Deadline Reminder System
**Priority**: 🔴 HIGH  
**Status**: ⏳ TODO  
**Estimated Time**: 8 hours  
**Assignee**: Open

**Description**:
Create a system to track notice deadlines and enable deadline reminders.

**Features**:
- Highlight notices approaching deadline (red badge)
- Separate "Approaching Deadlines" section on home
- Admin can set reminder threshold (default 7 days)
- Email notification system (Phase 2)

**Database Changes**:
```typescript
// Add to Notice interface
deadlineReminderDays?: number; // default 7
lastReminderSent?: Date;
isApproachingDeadline: boolean;
```

**Subtasks**:
- [ ] Update `Notice` type with deadline fields
- [ ] Create deadline calculation utility function
- [ ] Add "Approaching Deadlines" widget to home page
- [ ] Create admin setting for reminder days
- [ ] Add database computed field for isApproachingDeadline
- [ ] Create deadline badge component
- [ ] Update notice seed data with dates

**Files to Create**:
- `src/lib/utils/deadlineUtils.ts`
- `src/components/notices/DeadlineBadge.tsx`
- `src/components/home/ApproachingDeadlines.tsx`

**Files to Modify**:
- `src/types/index.ts`
- `src/app/(public)/page.tsx` (home page)
- `scripts/seed-simple.js`

**Acceptance Criteria**:
✅ Deadline calculation works correctly  
✅ Home page shows approaching deadlines  
✅ Admin can configure reminder days  
✅ Notices within threshold highlighted  

---

#### Task 1.1.3: SEO & Discoverability Improvements
**Priority**: 🟡 MEDIUM  
**Status**: ⏳ TODO  
**Estimated Time**: 6 hours  
**Assignee**: Open

**Description**:
Implement SEO best practices and improve search engine visibility.

**Features**:
- Dynamic XML sitemap generation
- Rich snippets (JSON-LD) for notices and posts
- Meta tags optimization
- Breadcrumb navigation
- Open Graph images

**Subtasks**:
- [ ] Create XML sitemap generator at `/sitemap.xml`
- [ ] Add JSON-LD schema for Notice items
- [ ] Add JSON-LD schema for BlogPost items
- [ ] Add JSON-LD schema for Organization
- [ ] Create breadcrumb component
- [ ] Add breadcrumbs to all pages
- [ ] Implement Open Graph meta tags
- [ ] Create robots.txt file
- [ ] Add canonical URLs

**Files to Create**:
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/utils/seoUtils.ts`
- `src/components/common/Breadcrumbs.tsx`
- `src/components/common/JsonLd.tsx`

**Files to Modify**:
- `src/app/layout.tsx`
- `src/app/(public)/layout.tsx`
- `src/app/(public)/notices/[slug]/page.tsx`
- `src/app/(public)/tips/[slug]/page.tsx`

**Acceptance Criteria**:
✅ Sitemap.xml accessible and valid  
✅ JSON-LD schemas showing in page source  
✅ Rich snippets visible in Google Search Console  
✅ Breadcrumbs visible on all pages  

---

#### Task 1.1.4: Notice Versioning & History
**Priority**: 🟡 MEDIUM  
**Status**: ⏳ TODO  
**Estimated Time**: 6 hours  
**Assignee**: Open

**Description**:
Implement notice version history to track changes.

**Database Changes**:
```typescript
// New collection: noticeVersions
NoticeVersion {
  id: string;
  noticeId: string;
  title: string;
  body: string;
  version: number;
  createdBy: string;
  createdAt: Date;
  changes?: string; // description of changes
}
```

**Subtasks**:
- [ ] Create `NoticeVersion` type
- [ ] Add versioning logic to notice update API
- [ ] Create version history component
- [ ] Add version comparison view
- [ ] Add rollback functionality in admin
- [ ] Update admin notice edit page

**Files to Create**:
- `src/lib/utils/versionUtils.ts`
- `src/components/admin/VersionHistory.tsx`

**Files to Modify**:
- `src/types/index.ts`
- `src/app/api/admin/notices/route.ts`
- `src/app/admin/notices/[id]/edit/page.tsx`

**Acceptance Criteria**:
✅ Version created on each update  
✅ Version history visible in admin  
✅ Rollback restores previous version  

---

### 1.2 User Experience Improvements

#### Task 1.2.1: Smart Search & Advanced Filters
**Priority**: 🔴 HIGH  
**Status**: ⏳ TODO  
**Estimated Time**: 8 hours  
**Assignee**: Open

**Description**:
Implement saved filters, search history, and advanced filtering options.

**Features**:
- Save custom filter combinations
- Search history for users
- Date range filters for deadlines
- Multi-category combination search
- Filter sharing (optional)

**Database Changes**:
```typescript
// New collection: userFilters
UserFilter {
  id: string;
  userId: string;
  name: string;
  filters: {
    categories: string[];
    universityTypes: string[];
    universities: string[];
    dateRange: { start: Date; end: Date };
  };
  isPublic: boolean;
  createdAt: Date;
  usageCount: number;
}

// New collection: searchHistory
SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: Record<string, unknown>;
  resultsCount: number;
  createdAt: Date;
}
```

**Subtasks**:
- [ ] Create `UserFilter` and `SearchHistory` types
- [ ] Build advanced filter UI component
- [ ] Create save filter functionality
- [ ] Implement search history tracking
- [ ] Add filter suggestions based on history
- [ ] Create filter management page
- [ ] Add filter API endpoints
- [ ] Update notices page with new filters

**Files to Create**:
- `src/components/notices/AdvancedFilters.tsx`
- `src/components/common/FilterSaver.tsx`
- `src/app/api/public/filters/route.ts`
- `src/app/api/public/search-history/route.ts`

**Files to Modify**:
- `src/types/index.ts`
- `src/app/(public)/notices/page.tsx`
- `src/hooks/useNotices.ts`

**Acceptance Criteria**:
✅ Users can save custom filters  
✅ Search history displayed to user  
✅ Saved filters can be reused  
✅ Filter suggestions work  

---

#### Task 1.2.2: User Preference Center
**Priority**: 🟡 MEDIUM  
**Status**: ⏳ TODO  
**Estimated Time**: 6 hours  
**Assignee**: Open

**Description**:
Create user preference system for personalization.

**Features**:
- Select favorite universities
- Choose notice categories of interest
- Set notification preferences
- Theme preferences (light/dark)
- Language preference (future: Bengali/English)

**Database Changes**:
```typescript
// Update AppUser interface
AppUser {
  // ... existing fields
  preferences: {
    favoriteUniversities: string[];
    noticeCategories: string[];
    notificationSettings: {
      emailNotifications: boolean;
      deadlineReminders: boolean;
      weeklyDigest: boolean;
      reminderDaysBefore: number;
    };
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'bn';
  };
}
```

**Subtasks**:
- [ ] Update `AppUser` type with preferences
- [ ] Create preference API endpoints
- [ ] Build preference UI component
- [ ] Add preference page to user profile
- [ ] Implement personalized feed based on preferences
- [ ] Add theme selector to header
- [ ] Create preference sync hook

**Files to Create**:
- `src/components/profile/PreferenceCenter.tsx`
- `src/app/api/public/user-preferences/route.ts`
- `src/hooks/useUserPreferences.ts`

**Files to Modify**:
- `src/types/index.ts`
- `src/app/profile/page.tsx`
- `src/context/AuthContext.tsx`

**Acceptance Criteria**:
✅ Users can set preferences  
✅ Preferences persist across sessions  
✅ Feed filters based on preferences  

---

#### Task 1.2.3: Personalized Notice Feed
**Priority**: 🟡 MEDIUM  
**Status**: ⏳ TODO  
**Estimated Time**: 6 hours  
**Assignee**: Open

**Description**:
Create algorithm to show personalized notices based on user preferences and behavior.

**Features**:
- Feed shows notices for favorite universities
- Prioritize selected categories
- Algorithm: recent + relevant + popular
- "For You" section on home page
- Smart recommendations

**Subtasks**:
- [ ] Create feed ranking algorithm function
- [ ] Implement personalized notices API endpoint
- [ ] Add "For You" section to home page
- [ ] Create recommendation engine utility
- [ ] Update profile page with my feed
- [ ] Add saved notices feature
- [ ] Create saved notices component

**Files to Create**:
- `src/lib/utils/feedAlgorithm.ts`
- `src/app/api/public/personalized-feed/route.ts`
- `src/components/notices/PersonalizedFeed.tsx`

**Files to Modify**:
- `src/app/(public)/page.tsx`
- `src/app/profile/page.tsx`

**Acceptance Criteria**:
✅ Feed shows relevant notices  
✅ Algorithm considers all factors  
✅ "For You" section works  

---

---

## 📊 Task Status Summary

| Phase | Status | Completion |
|-------|--------|-----------|
| **1.1 Content Management** | ⏳ TODO | 0% |
| Task 1.1.1 | ⏳ TODO | 0/4 |
| Task 1.1.2 | ⏳ TODO | 0/7 |
| Task 1.1.3 | ⏳ TODO | 0/9 |
| Task 1.1.4 | ⏳ TODO | 0/6 |
| **1.2 UX Improvements** | ⏳ TODO | 0% |
| Task 1.2.1 | ⏳ TODO | 0/8 |
| Task 1.2.2 | ⏳ TODO | 0/7 |
| Task 1.2.3 | ⏳ TODO | 0/7 |
| **PHASE 1 TOTAL** | ⏳ TODO | 0% |

---

## 🚀 How to Use This Document

1. **View Tasks**: Each task has clear description and subtasks
2. **Start Task**: Pick a task, update status to 🟢 IN PROGRESS
3. **Track Progress**: Check off subtasks as you complete them
4. **Mark Complete**: When all subtasks done, change to ✅ COMPLETED
5. **Document**: Add any notes or blockers

---

## 📝 Task Template (for new tasks)

```markdown
#### Task X.X.X: [Task Name]
**Priority**: 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW  
**Status**: ⏳ TODO / 🟢 IN PROGRESS / ✅ COMPLETED  
**Estimated Time**: X hours  
**Assignee**: [Name or Open]

**Description**:
[What needs to be done]

**Subtasks**:
- [ ] Subtask 1
- [ ] Subtask 2

**Files to Create**:
- `path/to/file.ts`

**Files to Modify**:
- `path/to/file.ts`

**Acceptance Criteria**:
✅ Criteria 1  
✅ Criteria 2  
```

---

**Last Updated**: May 27, 2026  
**Total Tasks**: 8  
**Completed**: 0  
**In Progress**: 0  
**To Do**: 8
