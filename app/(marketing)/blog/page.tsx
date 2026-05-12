import type { Metadata } from "next";
import { BlogPageContent } from "@/components/blog/blog-page-content";

export const metadata: Metadata = {
  title: "Blog & Guides | UAT Help",
  description: "Expert insights, comprehensive guides, and practical tips for your university admission journey in Bangladesh.",
};

export default function BlogPage() {
  return <BlogPageContent />;
}
