# 📋 TASK 1.1.3 PLAN: SEO & Discoverability

**Status**: 🟡 IN PROGRESS  
**Priority**: 🔴 HIGH  
**Estimated Duration**: 6-8 hours  
**Target Completion**: Today  

---

## 🎯 Objective

Improve search engine visibility, discoverability, and organic traffic by implementing comprehensive SEO improvements including:
1. Dynamic XML sitemap generation
2. JSON-LD structured data markup
3. Breadcrumb navigation
4. Optimized meta tags
5. Open Graph / Twitter Card support
6. Canonical URLs
7. Mobile optimization signals

---

## 📝 Work Breakdown

### Phase 1: Structured Data & Schema Markup (2 hours)
- [ ] Create JSON-LD schema generator utility
- [ ] Implement Organization schema
- [ ] Implement Article schema (for blog posts)
- [ ] Implement BreadcrumbList schema
- [ ] Add FAQSchema for common questions
- [ ] Update notice detail page with schema

### Phase 2: Sitemap Generation (1.5 hours)
- [ ] Create `public/sitemap.xml` generator script
- [ ] Set up dynamic route discovery
- [ ] Add sitemap index for scalability
- [ ] Create `robots.txt` file
- [ ] Update `next.config.js` for SEO

### Phase 3: Breadcrumb Navigation (1 hour)
- [ ] Create Breadcrumb component
- [ ] Implement on notice detail pages
- [ ] Implement on university pages
- [ ] Implement on blog post pages
- [ ] Add schema markup to breadcrumbs

### Phase 4: Meta Tags & OG Tags (1.5 hours)
- [ ] Create metadata utility helpers
- [ ] Update notice detail page metadata
- [ ] Update blog post metadata
- [ ] Update university page metadata
- [ ] Add Twitter Card tags

### Phase 5: Testing & Validation (1.5 hours)
- [ ] Test with Google's Rich Results Tester
- [ ] Validate schema with Structured Data Validator
- [ ] Test Open Graph with Facebook Debugger
- [ ] Check mobile usability
- [ ] Verify canonical URLs

---

## 🔧 Implementation Details

### Directory Structure
```
src/
  lib/
    seo/
      ├── schemas.ts           (JSON-LD schema generators)
      ├── metadata.ts          (Meta tag helpers)
      └── breadcrumbs.ts       (Breadcrumb utilities)
  components/
    seo/
      ├── SeoHead.tsx          (Head component with all SEO tags)
      └── Breadcrumbs.tsx      (Breadcrumb navigation)
public/
  ├── sitemap.xml             (XML sitemap)
  ├── robots.txt              (Robot exclusions)
  └── sitemap-index.xml       (Sitemap index)
```

### Key Components to Build

#### 1. Schema Generators
```typescript
// src/lib/seo/schemas.ts
- generateOrganizationSchema()
- generateArticleSchema(post)
- generateBreadcrumbSchema(items)
- generateFAQSchema(items)
- generateWebsiteSchema()
```

#### 2. Breadcrumb Component
```typescript
// src/components/seo/Breadcrumbs.tsx
<Breadcrumbs 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Notices', href: '/notices' },
    { label: 'Notice Title' }
  ]}
/>
```

#### 3. Sitemap Generator
```
Discover all:
- Published notices
- Published blog posts
- Universities
- Category pages
- Static pages
Generate frequency & priority
```

---

## 🚀 Expected Outcomes

### Search Visibility
- ✅ All pages indexed and discoverable
- ✅ Rich snippets showing in Google
- ✅ Breadcrumb navigation in results
- ✅ Mobile-friendly signals
- ✅ Structured data validation: 100%

### User Experience
- ✅ Clear navigation breadcrumbs
- ✅ Better internal linking
- ✅ Improved CTR from search results
- ✅ Social media previews optimized
- ✅ Better sharing potential

### Technical SEO
- ✅ XML sitemap for crawlers
- ✅ Robots.txt for crawl efficiency
- ✅ Canonical URLs preventing duplicates
- ✅ Proper heading hierarchy
- ✅ Schema validation: 100% pass

---

## 📊 Success Metrics

- [ ] 100% schema validation pass
- [ ] All pages have Open Graph tags
- [ ] Breadcrumbs on all detail pages
- [ ] Sitemap includes 100%+ of content
- [ ] No duplicate content issues
- [ ] Mobile Core Web Vitals: Good
- [ ] Page Speed Insights: 80+
- [ ] No crawl errors in GSC

---

## 🔗 Related Files

**To Update**:
- `src/app/(public)/notices/[slug]/page.tsx`
- `src/app/(public)/tips/[slug]/page.tsx`
- `src/app/(public)/universities/[slug]/page.tsx`
- `src/app/(public)/layout.tsx`
- `src/app/layout.tsx`
- `next.config.js`
- `package.json` (if adding scripts)

**To Create**:
- `src/lib/seo/schemas.ts`
- `src/lib/seo/metadata.ts`
- `src/lib/seo/breadcrumbs.ts`
- `src/components/seo/Breadcrumbs.tsx`
- `public/robots.txt`
- `public/sitemap.xml`
- `scripts/generate-sitemap.js`

---

## 🎯 Next Step

Start with **Phase 1: Structured Data & Schema Markup**
- Create schema generators
- Add to notice detail page
- Test with validator

Ready to proceed? ✨
