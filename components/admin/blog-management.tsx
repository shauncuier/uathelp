"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  Star,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "draft" | "published";
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  readTime?: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch blog posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
      });

      const response = await fetch(`/api/admin/blog?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const { data, pagination: paginationData } = await response.json();
      setPosts(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    return status === "published"
      ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200"
      : "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage blog articles and content
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            /* TODO: Open editor dialog */
          }}
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-72">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={(value: string | null) => {
            setStatusFilter(value ?? "");
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(value: string | null) => {
            setCategoryFilter(value ?? "");
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="rankings">Rankings</SelectItem>
              <SelectItem value="scholarships">Scholarships</SelectItem>
              <SelectItem value="preparation">Preparation</SelectItem>
              <SelectItem value="news">News</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter || categoryFilter) && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No blog posts found</p>
        </Card>
      ) : (
        <>
          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Title</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-center p-4 font-semibold">Status</th>
                    <th className="text-center p-4 font-semibold">Read Time</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, idx) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {post.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-xs text-muted-foreground">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="capitalize">
                          {post.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {post.readTime ? `${post.readTime} min` : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View"
                            className="p-0 h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Edit"
                            className="p-0 h-8 w-8"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Delete"
                            className="p-0 h-8 w-8 hover:text-red-600"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.pages}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
