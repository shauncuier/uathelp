"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HomeSearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/notices?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 justify-center pt-2">
      <div className="flex-1 max-w-sm flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices by university or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6">
          Search
        </Button>
      </div>
    </form>
  );
}
