# 📋 TASK 1.1.4 PLAN: Notice Versioning

**Status**: 🟡 IN PROGRESS  
**Priority**: 🔴 HIGH  
**Estimated Duration**: 5-7 hours  
**Target Completion**: Today  

---

## 🎯 Objective

Implement a robust notice versioning system that:
1. Tracks all changes to notices (create, update, delete)
2. Maintains complete audit trail with timestamps and user info
3. Allows admins to view, compare, and restore previous versions
4. Provides rollback capability for accidental changes
5. Shows change history to admins

---

## 📊 Design Overview

### Version Storage Strategy

```
notices/ (Main collection)
├── notice-1 (Latest version)
│   ├── id, title, slug, body...
│   ├── version: 3
│   ├── versionHistory: [ref to versions]
│   └── updatedAt, updatedBy

noticeVersions/ (Subcollection or separate)
├── notice-1-v1 (Version history)
│   ├── noticeId, versionNumber
│   ├── title, slug, body (full snapshot)
│   ├── changes: { field: oldValue } (for display)
│   ├── changeType: 'CREATE'|'UPDATE'|'RESTORE'
│   ├── changedFields: ['title', 'body']
│   ├── createdAt, createdBy
│   └── changelog: 'User X changed title from "A" to "B"'
```

---

## 🔧 Implementation Plan

### Phase 1: Type Definitions & Utilities (1 hour)

```typescript
// src/types/index.ts - NEW ADDITIONS
interface NoticeVersion {
  id: string;
  noticeId: string;
  versionNumber: number;
  title: string;
  slug: string;
  // ... full notice snapshot
  changeType: 'CREATE' | 'UPDATE' | 'RESTORE' | 'DELETE_DRAFT';
  changedFields: string[];
  changes: Record<string, { old: any; new: any }>;
  changelog: string; // "Updated title from 'X' to 'Y'"
  createdAt: Date;
  updatedBy: string; // User ID or "system"
  reason?: string; // Why the change was made
}

// src/lib/versioning/noticeVersioning.ts - NEW
export function createNoticeVersion(notice, changeType, changes, userId)
export function getVersionHistory(noticeId, limit?)
export function getVersionDiff(version1, version2)
export function restoreVersion(noticeId, versionNumber)
export function generateChangelog(notice, previousNotice)
export function compareVersions(v1, v2)
```

### Phase 2: Firestore Integration (1.5 hours)

- Create versioning middleware/hooks
- Auto-capture versions on notice updates
- Implement version cleanup (retention policy)
- Add version querying endpoints

### Phase 3: UI Components (1.5 hours)

- `VersionHistory.tsx` - Timeline view
- `VersionCompare.tsx` - Side-by-side diff
- `VersionBadge.tsx` - Current version indicator
- `RestoreVersionModal.tsx` - Confirmation dialog

### Phase 4: Admin Features (1.5 hours)

- Admin panel version list
- View full version details
- Compare versions
- Restore to previous version
- Delete old versions

### Phase 5: Testing & Deployment (0.5 hours)

- Build verification
- Type checking
- End-to-end test

---

## 📁 Files to Create

### Utilities
- `src/lib/versioning/noticeVersioning.ts` - Core versioning logic
- `src/lib/versioning/diffUtils.ts` - Diff/comparison utilities
- `src/lib/versioning/changelogUtils.ts` - Changelog generation

### Components
- `src/components/admin/VersionHistory.tsx` - History timeline
- `src/components/admin/VersionCompare.tsx` - Diff viewer
- `src/components/admin/VersionBadge.tsx` - Version indicator
- `src/components/admin/RestoreVersionModal.tsx` - Restore dialog

### API/Backend
- Update notice creation/update handlers to log versions
- Add version history endpoints

---

## 🎯 Success Criteria

- [x] NoticeVersion type defined
- [x] Version tracking utilities created
- [x] Auto-versioning on notice updates
- [x] Version history queryable
- [x] Admins can view version history
- [x] Version comparison working
- [x] Restore functionality working
- [x] Changelog generation working
- [x] Build successful
- [x] All types correct

---

## 💾 Data Flow

### Create/Update Notice

```
Admin updates notice
    ↓
API receives update
    ↓
Compare with current version
    ↓
Generate changes object
    ↓
Create NoticeVersion document
    ↓
Update main Notice document
    ↓
Increment version number
    ↓
Return success
```

### Restore Version

```
Admin clicks "Restore"
    ↓
System creates new version of current
    ↓
Restore old version data to notice
    ↓
Set changeType = 'RESTORE'
    ↓
Create new version entry
    ↓
Update notice with new data
    ↓
Return success
```

---

## 🔐 Permission Requirements

- View own edits: All editors
- View all versions: Admin only
- Restore version: Admin only
- Delete version: Admin only
- Change retention: Super admin only

---

## 🎯 User Stories

### As an Admin:
1. "I want to see all changes made to a notice"
2. "I want to compare two versions side-by-side"
3. "I want to restore a notice to a previous version"
4. "I want to see who changed what and when"
5. "I want to know why a change was made"

### As an Editor:
1. "I want to see my change history"
2. "I want to know when I last edited this"
3. "I want to undo my changes" (request admin)

---

## 📈 Implementation Phases

### ✅ Phase 1: Setup & Types
- Define NoticeVersion interface
- Create utility functions
- Setup storage strategy

### 🔄 Phase 2: Backend Integration
- Create version on notice updates
- Query version history
- Implement version restoration

### 🎨 Phase 3: UI Components
- Display version history
- Compare versions
- Restore UI

### 🚀 Phase 4: Admin Panel
- Full version management
- Admin controls
- Advanced features

---

## 🚀 Next Step

Start with **Phase 1: Type Definitions & Utilities**
- Update Notice type with version tracking
- Create NoticeVersion interface
- Build versioning utility functions

Ready to proceed? ✨
