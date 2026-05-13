import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { universities } from "@/config/universities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// In a real application, this would fetch from Firestore
async function getUniversities() {
  return universities.map((u) => ({
    id: u.id,
    name: u.name,
    type: u.type,
    location: u.location,
    minGpa: u.minGpa,
  }));
}

export default async function AdminUniversitiesPage() {
  const data = await getUniversities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Universities</h1>
          <p className="text-sm text-muted-foreground">
            Manage the universities database.
          </p>
        </div>
        <Button className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="size-4" />
          Add University
        </Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
