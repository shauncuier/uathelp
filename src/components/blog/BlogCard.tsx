// src/components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { format } from "date-fns";

function toDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (val?.toDate) return val.toDate();
  if (typeof val === "string") return new Date(val);
  if (val?.seconds) return new Date(val.seconds * 1000);
  return null;
}

export function BlogCard({ post }: { post: BlogPost }) {
  const published = toDate(post.publishedAt || post.createdAt);

  return (
    <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group rounded-xl">
      {post.imageUrl && (
        <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardContent className="p-6">
        <CategoryBadge category={post.category} />
        <Link href={`/tips/${post.slug}`}>
          <h3 className="font-bold text-lg text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 mt-3 mb-3 cursor-pointer">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
        {published && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 pb-4 border-b border-slate-100">
            <Calendar className="h-4 w-4" />
            <span>{format(published, "dd MMM yyyy")}</span>
          </div>
        )}
        <Link href={`/tips/${post.slug}`}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
            Read Article <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
