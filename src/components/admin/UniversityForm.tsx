"use client";
// src/components/admin/UniversityForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUniversitySchema, CreateUniversityInput } from "@/lib/validations/university";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/server/slug";
import { useEffect } from "react";
import { useState } from "react";

interface Props {
  initialData?: Partial<CreateUniversityInput> & { id?: string };
  mode: "create" | "edit";
}

const types = ["public","private","national","medical","engineering","agriculture"];
const divisions = ["Dhaka","Chittagong","Rajshahi","Khulna","Barishal","Sylhet","Rangpur","Mymensingh"];

export function UniversityForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(createUniversitySchema),
    defaultValues: {
      nameEn: "", nameBn: "", shortName: "", type: "public",
      division: "", district: "", officialWebsite: "", isFeatured: false,
      ...initialData,
    },
  });

  const watchNameEn = form.watch("nameEn");
  useEffect(() => {
    if (mode === "create" && watchNameEn) form.setValue("slug", generateSlug(watchNameEn));
  }, [watchNameEn, mode, form]);

  const onSubmit = async (data: CreateUniversityInput) => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const url = mode === "edit" ? `/api/admin/universities/${initialData?.id}` : "/api/admin/universities";
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error?.message);
      toast.success(mode === "create" ? "University created!" : "University updated!");
      router.push("/admin/universities");
    } catch (err: any) {
      toast.error(err.message || "Failed to save university");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>English Name *</Label>
          <Input {...form.register("nameEn")} placeholder="University of Dhaka" />
        </div>
        <div className="space-y-1.5">
          <Label>Bangla Name *</Label>
          <Input {...form.register("nameBn")} placeholder="ঢাকা বিশ্ববিদ্যালয়" className="font-bn" />
        </div>
        <div className="space-y-1.5">
          <Label>Short Name *</Label>
          <Input {...form.register("shortName")} placeholder="DU" />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...form.register("slug")} placeholder="university-of-dhaka" />
        </div>
        <div className="space-y-1.5">
          <Label>Type *</Label>
          <Select onValueChange={(v: any) => form.setValue("type", v)} defaultValue={initialData?.type || "public"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Division *</Label>
          <Select onValueChange={(v) => form.setValue("division", v)} defaultValue={initialData?.division || undefined}>
            <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
            <SelectContent>{divisions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>District *</Label>
          <Input {...form.register("district")} placeholder="e.g. Dhaka" />
        </div>
        <div className="space-y-1.5">
          <Label>Official Website *</Label>
          <Input {...form.register("officialWebsite")} placeholder="https://du.ac.bd" />
        </div>
        <div className="space-y-1.5">
          <Label>Admission Website</Label>
          <Input {...form.register("admissionWebsite")} placeholder="https://admission.du.ac.bd" />
        </div>
        <div className="space-y-1.5">
          <Label>Logo URL</Label>
          <Input {...form.register("logoUrl")} placeholder="https://..." />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Description</Label>
          <Textarea {...form.register("description")} placeholder="About this university..." rows={3} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...form.register("isFeatured")} className="rounded" />
          <span className="text-sm font-medium">Featured University</span>
        </label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : mode === "create" ? "Create University" : "Update University"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/universities")}>Cancel</Button>
      </div>
    </form>
  );
}
