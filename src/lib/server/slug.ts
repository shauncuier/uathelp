// src/lib/server/slug.ts
// Slug generation and sanitization utilities
import slugify from "slugify";

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "-",
  });
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateUniqueSlug(
  adminDb: FirebaseFirestore.Firestore,
  collectionName: string,
  baseText: string,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(baseText);
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const snap = await adminDb.collection(collectionName).where("slug", "==", slug).limit(1).get();
    
    if (snap.empty) {
      isUnique = true;
    } else {
      if (excludeId && snap.docs[0].id === excludeId) {
        isUnique = true;
      } else {
        slug = `${generateSlug(baseText)}-${counter}`;
        counter++;
      }
    }
  }

  return slug;
}
