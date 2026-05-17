// src/components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
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
    <Card className="card-hover overflow-hidden">
      {post.imageUrl && (
        <div className="relative h-44 bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-5">
        <CategoryBadge category={post.category} />
        <Link href={`/tips/${post.slug}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mt-2 mb-2 cursor-pointer">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
        {published && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(published, "dd MMM yyyy")}</span>
          </div>
        )}
        <Link href={`/tips/${post.slug}`}>
          <Button variant="outline" size="sm" className="w-full">Read More</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
