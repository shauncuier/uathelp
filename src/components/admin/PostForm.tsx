"use client";
// src/components/admin/PostForm.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, CreatePostInput } from "@/lib/validations/post";
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
import Editor from "react-simple-wysiwyg";

interface PostFormProps {
  initialData?: Partial<CreatePostInput> & { id?: string };
  mode: "create" | "edit";
}

const categories = ["tips", "guide", "routine", "strategy", "subject-guide", "news"];
const statuses = ["draft", "published", "archived"];

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "", slug: "", excerpt: "", content: "",
      category: "tips", tags: [], imageUrl: "", status: "draft",
      seoTitle: "", seoDescription: "",
      ...initialData,
    },
  });

  const watchTitle = form.watch("title");
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      form.setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, mode, form]);

  const onSubmit = async (data: CreatePostInput) => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const url = mode === "edit" ? `/api/admin/posts/${initialData?.id}` : "/api/admin/posts";
      const method = mode === "edit" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || result.message || "Failed to save post");
      toast.success(mode === "create" ? "Post created!" : "Post updated!");
      router.push("/admin/posts");
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors: any) => {
    toast.error("Please fix the errors in the form before submitting.");
    console.log("Validation Errors:", errors);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input {...form.register("title")} placeholder="Post title" />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input {...form.register("slug")} placeholder="auto-generated-from-title" />
        </div>
        
        <div className="space-y-1.5">
          <Label>Excerpt *</Label>
          <Textarea {...form.register("excerpt")} placeholder="Brief summary (shown on cards)..." rows={3} />
          {form.formState.errors.excerpt && <p className="text-xs text-destructive">{form.formState.errors.excerpt.message}</p>}
        </div>
        
        <div className="space-y-1.5">
          <Label>Content *</Label>
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <Editor
                value={field.value}
                onChange={field.onChange}
                containerProps={{ style: { minHeight: "350px" } }}
              />
            )}
          />
          {form.formState.errors.content && <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select onValueChange={(v: any) => form.setValue("category", v)} defaultValue={initialData?.category || "tips"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label>Status *</Label>
            <Select onValueChange={(v: any) => form.setValue("status", v)} defaultValue={initialData?.status || "draft"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Cover Image URL</Label>
          <Input {...form.register("imageUrl")} type="url" placeholder="https://example.com/image.jpg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>SEO Title</Label>
            <Input {...form.register("seoTitle")} placeholder="Custom SEO Title" />
          </div>
          <div className="space-y-1.5">
            <Label>SEO Description</Label>
            <Input {...form.register("seoDescription")} placeholder="Custom SEO Description" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Post" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
