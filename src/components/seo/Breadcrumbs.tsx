// src/components/seo/Breadcrumbs.tsx
/**
 * Breadcrumb Navigation Component
 * Displays hierarchical navigation path with schema markup
 */

"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Breadcrumb } from "@/lib/seo/breadcrumbs";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
  showSchema?: boolean;
}

export function Breadcrumbs({
  items,
  className = "",
  showSchema = true,
}: BreadcrumbsProps) {
  // Generate schema markup
  const schemaItems = items.map((item) => ({
    label: item.label,
    url: item.href,
  }));
  const schema = generateBreadcrumbSchema(schemaItems);

  return (
    <>
      {/* Hidden schema markup for search engines */}
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      )}

      {/* Visible breadcrumb navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-2 text-sm ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    isLast
                      ? "text-slate-900 font-medium"
                      : "text-slate-600"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Compact breadcrumbs for mobile
 */
export function BreadcrumbsCompact({
  items,
  className = "",
}: BreadcrumbsProps) {
  const lastTwoItems = items.slice(-2);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 text-xs ${className}`}
    >
      {lastTwoItems.map((item, index) => {
        const isLast = index === lastTwoItems.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
            )}

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  isLast
                    ? "text-slate-900 font-medium truncate"
                    : "text-slate-600"
                }`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Breadcrumbs with background styling
 */
export function BreadcrumbsStyled({
  items,
  className = "",
}: BreadcrumbsProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumbs items={items} className={className} />
      </div>
    </div>
  );
}
