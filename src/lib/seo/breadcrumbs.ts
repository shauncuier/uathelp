// src/lib/seo/breadcrumbs.ts
/**
 * Breadcrumb Navigation Utilities for SEO and UX
 * Helps with navigation and generates breadcrumb schema markup
 */

export interface Breadcrumb {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

/**
 * Generate breadcrumbs for notice detail page
 */
export function getNoticeBreadcrumbs(
  noticeTitle: string,
  category: string
): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: "Notices", href: "/notices" },
    { label: capitalizeCategory(category), href: `/notices?category=${category}` },
    { label: noticeTitle, isCurrentPage: true },
  ];
}

/**
 * Generate breadcrumbs for blog post detail page
 */
export function getBlogPostBreadcrumbs(
  postTitle: string,
  category: string
): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: "Tips & Guides", href: "/tips" },
    { label: capitalizeCategory(category), href: `/tips?category=${category}` },
    { label: postTitle, isCurrentPage: true },
  ];
}

/**
 * Generate breadcrumbs for university detail page
 */
export function getUniversityBreadcrumbs(universityName: string): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    { label: "Universities", href: "/universities" },
    { label: universityName, isCurrentPage: true },
  ];
}

/**
 * Generate breadcrumbs for filtered/search pages
 */
export function getFilteredNoticeBreadcrumbs(
  filterType: string,
  filterValue: string
): Breadcrumb[] {
  const filterLabel = capitalizeCategory(filterValue);
  return [
    { label: "Home", href: "/" },
    { label: "Notices", href: "/notices" },
    { label: `${filterType}: ${filterLabel}`, isCurrentPage: true },
  ];
}

/**
 * Generate breadcrumbs for search results
 */
export function getSearchResultsBreadcrumbs(searchTerm: string): Breadcrumb[] {
  return [
    { label: "Home", href: "/" },
    {
      label: `Search: "${searchTerm}"`,
      isCurrentPage: true,
    },
  ];
}

/**
 * Custom breadcrumbs builder
 * Allows creating custom breadcrumb trails
 */
export class BreadcrumbBuilder {
  private breadcrumbs: Breadcrumb[] = [];

  constructor() {
    this.breadcrumbs = [{ label: "Home", href: "/" }];
  }

  add(label: string, href?: string): this {
    this.breadcrumbs.push({ label, href });
    return this;
  }

  setCurrent(label: string): this {
    this.breadcrumbs.push({ label, isCurrentPage: true });
    return this;
  }

  build(): Breadcrumb[] {
    return this.breadcrumbs;
  }

  toJSON() {
    return this.breadcrumbs;
  }
}

/**
 * Helper: Capitalize category names
 */
function capitalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    "admission-circular": "Admission Circular",
    "admit-card": "Admit Card",
    result: "Result",
    routine: "Routine",
    exam: "Exam",
    "seat-plan": "Seat Plan",
    scholarship: "Scholarship",
    "test-notice": "Test Notice",
    "application-end": "Application End",
    general: "General",
    // Blog categories
    "study-tips": "Study Tips",
    "exam-prep": "Exam Prep",
    "university-review": "University Review",
    "career-guidance": "Career Guidance",
    "course-review": "Course Review",
    tips: "Tips",
  };

  return categoryMap[category] || category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get page title from breadcrumbs for SEO
 */
export function getTitleFromBreadcrumbs(breadcrumbs: Breadcrumb[]): string {
  const currentPage = breadcrumbs.find((b) => b.isCurrentPage);
  return currentPage?.label || "Page";
}

/**
 * Validate breadcrumbs structure
 */
export function validateBreadcrumbs(breadcrumbs: Breadcrumb[]): boolean {
  // First item should always be Home
  if (!breadcrumbs[0] || breadcrumbs[0].label !== "Home") {
    console.warn("First breadcrumb should be 'Home'");
    return false;
  }

  // Last item should be current page
  const lastItem = breadcrumbs[breadcrumbs.length - 1];
  if (!lastItem.isCurrentPage) {
    console.warn("Last breadcrumb should have isCurrentPage=true");
    return false;
  }

  // No more than 5 levels typically (UX best practice)
  if (breadcrumbs.length > 5) {
    console.warn("Breadcrumb trail too deep (>5 levels)");
  }

  return true;
}
