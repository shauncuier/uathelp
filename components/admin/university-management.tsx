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
  CheckCircle,
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

interface University {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  type: "public" | "private" | "international";
  ranking?: number;
  website: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function UniversityManagement() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch universities
  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        type: typeFilter,
      });

      const response = await fetch(`/api/admin/universities?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }

      const { data, pagination: paginationData } = await response.json();
      setUniversities(data);
      setPagination(paginationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, typeFilter]);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Delete university
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      const response = await fetch(`/api/admin/universities`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete university");
      }

      setUniversities(universities.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setCurrentPage(1);
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
          <h1 className="text-3xl font-bold text-foreground">Universities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage university database and information
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            /* TODO: Open create dialog */
          }}
        >
          <Plus className="w-4 h-4" />
          Add University
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-72">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={typeFilter} onValueChange={(value: string | null) => {
            setTypeFilter(value ?? "");
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || typeFilter) && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
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
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
          </div>
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
      ) : universities.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No universities found</p>
        </Card>
      ) : (
        <>
          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">City</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-center p-4 font-semibold">Ranking</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((uni, idx) => (
                    <motion.tr
                      key={uni.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{uni.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {uni.shortCode}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{uni.city}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 capitalize">
                          {uni.type}
                        </span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {uni.ranking ? `#${uni.ranking}` : "-"}
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
                            onClick={() => handleDelete(uni.id)}
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
