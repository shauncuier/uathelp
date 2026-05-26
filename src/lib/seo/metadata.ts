// src/lib/seo/metadata.ts
/**
 * Metadata and Meta Tags Utilities for SEO
 * Generates proper open graph, twitter cards, and canonical URLs
 */

import { Metadata } from "next";
import { Notice, BlogPost } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://uathelp.com";

/**
 * Generate metadata for a notice detail page
 */
export function generateNoticeMetadata(
  notice: Partial<Notice>
): Metadata {
  const title = `${notice.title} - Admission Notice`;
  const description =
    notice.summary ||
    `Latest admission notice from ${notice.universityName}. Check eligibility, application deadline, and required documents.`;
  const url = `${baseUrl}/notices/${notice.slug}`;
  const image = (notice as any).image || notice.imageUrl || `${baseUrl}/default-notice-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: notice.title || "Admission Notice",
        },
      ],
      siteName: "UAT Help",
      authors: ["UAT Help Team"],
      publishedTime: notice.publishedAt?.toString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    keywords: [
      ...(notice.searchKeywords || []),
      "admission",
      "notice",
      notice.universityName || "",
      "bangladesh",
    ].filter(Boolean),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate metadata for a blog post detail page
 */
export function generateBlogPostMetadata(post: Partial<BlogPost>): Metadata {
  const title = `${post.title} - UAT Help`;
  const description =
    post.excerpt ||
    `Learn about ${post.title?.toLowerCase() || 'tips'} with expert tips for university admissions`;
  const url = `${baseUrl}/tips/${post.slug}`;
  const image = (post as any).coverImage || post.imageUrl || `${baseUrl}/default-blog-image.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title || "Blog Post",
        },
      ],
      siteName: "UAT Help",
      authors: ["UAT Help Team"],
      publishedTime: post.publishedAt?.toString(),
      modifiedTime: post.updatedAt?.toString(),
      tags: post.tags || (post.category ? [post.category] : []),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    keywords: [
      post.category || "",
      ...(post.tags || []),
      "admission",
      "tips",
      "guide",
      "bangladesh",
    ].filter(Boolean),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate metadata for a university detail page
 */
export function generateUniversityMetadata(
  universityName: string,
  universitySlug: string,
  description: string,
  noticeCount: number = 0
): Metadata {
  const title = `${universityName} Admission | UAT Help`;
  const fullDescription =
    description ||
    `Find all admission notices, results, and admission information for ${universityName}. ${noticeCount} notices available.`;
  const url = `${baseUrl}/universities/${universitySlug}`;
  const image = `${baseUrl}/university-default.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description: fullDescription,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: universityName,
        },
      ],
      siteName: "UAT Help",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription,
      images: [image],
    },
    keywords: [
      universityName,
      "admission",
      "notices",
      "results",
      "admit card",
      "bangladesh",
      "admission circular",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate metadata for list pages
 */
export function generateListPageMetadata(
  title: string,
  description: string,
  path: string,
  keywords: string[] = []
): Metadata {
  const url = `${baseUrl}${path}`;
  const image = `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} - UAT Help`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} - UAT Help`,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "UAT Help",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - UAT Help`,
      description,
      images: [image],
    },
    keywords: [title, "admission", "bangladesh", ...keywords],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/**
 * Generate base metadata for all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | UAT Help",
    default: "UAT Help — University Admission Notices & Resources",
  },
  description:
    "Find admission circulars, results, admit cards, and preparation tips for Bangladeshi universities. All in one place.",
  keywords: [
    "admission",
    "university",
    "bangladesh",
    "notices",
    "results",
    "admit card",
    "circular",
  ],
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: baseUrl,
    siteName: "UAT Help",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "UAT Help",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@uathelp",
    creator: "@uathelp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${baseUrl}${path}`;
}

/**
 * Generate URL with tracking parameters for social sharing
 */
export function getShareUrl(
  path: string,
  source: "twitter" | "facebook" | "linkedin" = "twitter"
): string {
  const url = getCanonicalUrl(path);
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: "social",
    utm_campaign: "share",
  });
  return `${url}?${params.toString()}`;
}

/**
 * Extract domain-specific keywords from content
 */
export function extractKeywords(text: string, limit: number = 5): string[] {
  // Simple keyword extraction - can be enhanced
  const keywords = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4);
  return [...new Set(keywords)].slice(0, limit);
}
