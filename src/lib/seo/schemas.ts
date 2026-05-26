// src/lib/seo/schemas.ts
/**
 * JSON-LD Schema Generators for SEO
 * These functions create structured data markup that helps search engines
 * understand and display content in rich results
 */

import { Notice, BlogPost } from "@/types";

/**
 * Organization schema for the website
 * Appears in knowledge panels and rich results
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UAT Help",
    url: "https://uathelp.com",
    logo: "https://uathelp.com/logo.png",
    description:
      "Bangladesh's #1 admission platform with notices, results, and preparation guides for universities",
    sameAs: [
      "https://facebook.com/uathelp",
      "https://twitter.com/uathelp",
      "https://instagram.com/uathelp",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@uathelp.com",
    },
  };
}

/**
 * Website schema
 * Improves sitelinks and site information display
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UAT Help",
    url: "https://uathelp.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://uathelp.com/notices?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Article/BlogPost schema for blog posts
 * Creates rich snippets with image, author, publish date
 */
export function generateArticleSchema(
  post: Partial<BlogPost>,
  baseUrl: string = "https://uathelp.com"
) {
  const publishDate = toISO8601(post.publishedAt);
  const modifiedDate = toISO8601(post.updatedAt || post.publishedAt);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || (post as any).summary,
    image: (post as any).coverImage || post.imageUrl || `${baseUrl}/default-blog-image.jpg`,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Organization",
      name: "UAT Help",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "UAT Help",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/tips/${post.slug}`,
    },
  };
}

/**
 * Breadcrumb list schema
 * Shows navigation hierarchy in search results
 */
export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string = "https://uathelp.com"
) {
  const breadcrumbList = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.url ? `${baseUrl}${item.url}` : undefined,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbList.filter((item) => item.item),
  };
}

/**
 * Notice/Event schema for admission notices
 * Shows deadlines and application information
 */
export function generateNoticeSchema(
  notice: Partial<Notice>,
  baseUrl: string = "https://uathelp.com"
) {
  const startDate = toISO8601(notice.publishedAt);
  const endDate = notice.applicationEnd && notice.applicationEnd instanceof Date
    ? toISO8601(notice.applicationEnd)
    : notice.applicationEnd
      ? toISO8601(notice.applicationEnd)
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: notice.title,
    description: notice.summary,
    url: `${baseUrl}/notices/${notice.slug}`,
    startDate: startDate,
    endDate: endDate,
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: notice.universityName,
    },
    image: (notice as any).image || notice.imageUrl || `${baseUrl}/default-notice-image.jpg`,
    location: {
      "@type": "Place",
      name: notice.universityName,
    },
  };
}

/**
 * FAQ Schema for common questions
 * Creates expandable FAQ sections in search results
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * University organization schema
 * Improves university page information display
 */
export interface UniversityInfo {
  name: string;
  slug: string;
  description: string;
  type: string;
  established?: number;
  location?: string;
  website?: string;
  noticeCount?: number;
}

export function generateUniversitySchema(
  university: UniversityInfo,
  baseUrl: string = "https://uathelp.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: university.name,
    description: university.description,
    url: `${baseUrl}/universities/${university.slug}`,
    foundingDate: university.established?.toString(),
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
      addressLocality: university.location || "Bangladesh",
    },
  };
}

/**
 * Helper: Convert any date format to ISO8601 string
 */
function toISO8601(value: any): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (value?.toDate) return value.toDate().toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  if (value?.seconds) return new Date(value.seconds * 1000).toISOString();
  return new Date().toISOString();
}

/**
 * Combine multiple schemas into a single structured data block
 * Useful for pages with multiple schema types
 */
export function combineSchemas(...schemas: any[]): any[] {
  return schemas.filter(Boolean);
}

/**
 * Serialize schemas to JSON-LD script tag format
 */
export function serializeSchemaToScript(schemas: any[]): string {
  return `
    <script type="application/ld+json">
      ${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2)}
    </script>
  `.trim();
}
