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
  Clock,
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

interface Circular {
  id: string;
  title: string;
  universityId: string;
  universities: {
    name: string;
    shortCode: string;
  };
  programs: string[];
  applicationDeadline: string;
  status: "active" | "closed" | "draft";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function CircularsManagement() {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch circulars
  const fetchCirculars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/circulars?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch circulars");
      }

      const { data, pagination: paginationData } = await response.json();
      setCirculars(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchCirculars();
  }, [fetchCirculars]);

  // Delete circular
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this circular?")) return;

    try {
      const response = await fetch(`/api/admin/circulars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete circular");
      }

      setCirculars(circulars.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200";
      case "closed":
        return "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200";
      default:
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200";
    }
  };

  const isDeadlineSoon = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 7 && days > 0;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
          <h1 className="text-3xl font-bold text-foreground">
            Admission Circulars
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage admission circulars and deadlines
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            /* TODO: Open create dialog */
          }}
        >
          <Plus className="w-4 h-4" />
          New Circular
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-72">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search circulars..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || statusFilter) && (
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
      ) : circulars.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No circulars found</p>
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
                    <th className="text-left p-4 font-semibold">University</th>
                    <th className="text-left p-4 font-semibold">Deadline</th>
                    <th className="text-center p-4 font-semibold">Status</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {circulars.map((circular, idx) => (
                    <motion.tr
                      key={circular.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{circular.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {circular.programs.length} programs
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {circular.universities.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {circular.universities.shortCode}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {isDeadlineSoon(circular.applicationDeadline) && (
                            <Clock className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-muted-foreground">
                            {formatDate(circular.applicationDeadline)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            circular.status
                          )}`}
                        >
                          {circular.status}
                        </span>
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
                            onClick={() => handleDelete(circular.id)}
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
