"use client";
// src/components/admin/NoticeForm.tsx
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoticeSchema, CreateNoticeFormInput, CreateNoticeInput } from "@/lib/validations/notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/server/slug";
import { useEffect, useState } from "react";

interface NoticeFormProps {
  initialData?: Partial<CreateNoticeInput> & { id?: string };
  mode: "create" | "edit";
}

type UniversityOption = {
  id: string;
  nameEn: string;
};

const categories = ["admission", "result", "seat-plan", "routine", "job", "scholarship", "general"];
const uniTypes = ["public", "private", "national", "medical", "engineering", "agriculture"];
const statuses = ["draft", "published", "archived"];

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function NoticeForm({ initialData, mode }: NoticeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);

  const form = useForm<CreateNoticeFormInput, unknown, CreateNoticeInput>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues: {
      title: "", summary: "", body: "", universityId: "", universityName: "",
      category: "admission", universityType: "public", session: "", tags: [],
      isFeatured: false, isUrgent: false, status: "draft",
      ...initialData,
    },
  });

  useEffect(() => {
    const token = auth.currentUser?.getIdToken();
    if (!token) return;
    auth.currentUser?.getIdToken().then((t) => {
      fetch("/api/admin/universities", { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => r.json())
        .then((d) => setUniversities(d.data?.universities || []));
    });
  }, []);

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      form.setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, mode, form]);

  const onSubmit = async (data: CreateNoticeInput) => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const url = mode === "edit" ? `/api/admin/notices/${initialData?.id}` : "/api/admin/notices";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || result.message || "Failed to save notice");
      toast.success(mode === "create" ? "Notice created!" : "Notice updated!");
      router.push("/admin/notices");
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to save notice"));
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: FieldErrors<CreateNoticeFormInput>) => {
    toast.error("Please fix the errors in the form before submitting.");
    console.log("Validation Errors:", errors);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label>Title *</Label>
          <Input {...form.register("title")} placeholder="Notice title" />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Slug</Label>
          <Input {...form.register("slug")} placeholder="auto-generated-from-title" />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Summary *</Label>
          <Textarea {...form.register("summary")} placeholder="Brief summary..." rows={2} />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Body *</Label>
          <Textarea {...form.register("body")} placeholder="Full notice content (HTML supported)..." rows={8} />
        </div>

        <div className="space-y-1.5">
          <Label>University</Label>
          <Select onValueChange={(v) => {
            if (!v) return;
            const uni = universities.find((u) => u.id === v);
            form.setValue("universityId", v);
            if (uni) form.setValue("universityName", uni.nameEn);
          }} defaultValue={initialData?.universityId || undefined}>
            <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
            <SelectContent>
              {universities.map((u) => <SelectItem key={u.id} value={u.id}>{u.nameEn}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>University Name (Manual)</Label>
          <Input {...form.register("universityName")} placeholder="e.g. University of Dhaka" />
        </div>

        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select onValueChange={(v) => v && form.setValue("category", v as CreateNoticeFormInput["category"])} defaultValue={initialData?.category || "admission"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>University Type *</Label>
          <Select onValueChange={(v) => v && form.setValue("universityType", v as CreateNoticeFormInput["universityType"])} defaultValue={initialData?.universityType || "public"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{uniTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Session *</Label>
          <Input {...form.register("session")} placeholder="e.g. 2025-26" />
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input {...form.register("unit")} placeholder="e.g. A, B, C" />
        </div>

        <div className="space-y-1.5">
          <Label>Application Start</Label>
          <Input type="datetime-local" {...form.register("applicationStart")} />
        </div>
        <div className="space-y-1.5">
          <Label>Application Deadline</Label>
          <Input type="datetime-local" {...form.register("applicationEnd")} />
        </div>
        <div className="space-y-1.5">
          <Label>Exam Date</Label>
          <Input type="datetime-local" {...form.register("examDate")} />
        </div>
        <div className="space-y-1.5">
          <Label>Result Date</Label>
          <Input type="datetime-local" {...form.register("resultDate")} />
        </div>

        <div className="space-y-1.5">
          <Label>PDF URL</Label>
          <Input {...form.register("pdfUrl")} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label>Official URL</Label>
          <Input {...form.register("officialUrl")} placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label>Image URL</Label>
          <Input {...form.register("imageUrl")} placeholder="https://..." />
        </div>

        <div className="space-y-1.5">
          <Label>Status *</Label>
          <Select onValueChange={(v) => v && form.setValue("status", v as CreateNoticeFormInput["status"])} defaultValue={initialData?.status || "draft"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>SEO Title</Label>
          <Input {...form.register("seoTitle")} placeholder="SEO title (max 70 chars)" />
        </div>
        <div className="space-y-1.5">
          <Label>SEO Description</Label>
          <Input {...form.register("seoDescription")} placeholder="SEO description (max 160 chars)" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register("isFeatured")} className="rounded" />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register("isUrgent")} className="rounded" />
            <span className="text-sm">Urgent</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Notice" : "Update Notice"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/notices")}>Cancel</Button>
      </div>
    </form>
  );
}
