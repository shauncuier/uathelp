export type UniversityType =
  | "public"
  | "private"
  | "national"
  | "medical"
  | "engineering";

export interface University {
  id: string;
  name: string;
  slug: string;
  type: UniversityType;
  location: string;
  description: string;
  logoUrl?: string;
  website: string;
  minGpa: number;
  seatCount: number;
  establishedYear: number;
  ranking?: number;
  isFeatured: boolean;
  programs: string[];
  admissionDeadline?: string;
  examDate?: string;
}

export interface UniversityFilters {
  type?: UniversityType;
  location?: string;
  minGpa?: number;
  maxGpa?: number;
  search?: string;
  sort?: "name" | "ranking" | "deadline" | "established";
}
