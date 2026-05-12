"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Share2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Post {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string;
  author: string;
  tags: string[];
}

export function BlogPostContent({ post }: { post: Post }) {
  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{post.category}</Badge>
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-blue-400" />
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-purple-400" />
              {post.readTime} read
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">✍️</span>
              <span>{post.author}</span>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Content */}
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="mt-8 mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  {paragraph.replace("## ", "")}
                </motion.h2>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <motion.ul
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="my-4 space-y-3"
                >
                  {paragraph.split("\n").map((line, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground text-base leading-relaxed flex gap-3"
                    >
                      <span className="text-blue-400">•</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: line
                            .replace("- ", "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>"),
                        }}
                      />
                    </li>
                  ))}
                </motion.ul>
              );
            }
            if (paragraph.match(/^\d\./)) {
              return (
                <motion.ol
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="my-4 space-y-3 list-decimal list-inside"
                >
                  {paragraph.split("\n").map((line, j) => (
                    <li
                      key={j}
                      className="text-muted-foreground text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/^\d+\.\s/, "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>"),
                      }}
                    />
                  ))}
                </motion.ol>
              );
            }
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="text-muted-foreground text-base leading-relaxed"
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>

        <Separator className="my-8" />

        {/* Share and actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-card/50 border border-border/50"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">Found this helpful?</p>
            <p className="text-xs text-muted-foreground">Share this guide with your friends to help them on their admission journey.</p>
          </div>
          <Button className="gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Share2 className="size-4" />
            Share
          </Button>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3"
        >
          <AlertCircle className="size-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Tip:</p>
            <p>Join UAT Help to get personalized recommendations and track your applications. Our AI advisor can guide you through each step of the process.</p>
          </div>
        </motion.div>
      </motion.div>
    </article>
  );
}
