export interface CircularData {
  id: string;
  universitySlug: string;
  universityName: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  deadline: string | null;
  examDate: string | null;
  isFeatured: boolean;
  status: "Published" | "Draft";
  createdAt: string;
}

export const circulars: CircularData[];
