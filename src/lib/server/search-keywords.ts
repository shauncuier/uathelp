// src/lib/server/search-keywords.ts
// Search keyword generation for Firestore array-contains queries

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateSearchKeywords(inputs: string[]): string[] {
  const keywordsSet = new Set<string>();

  for (const input of inputs) {
    if (!input) continue;
    const normalized = normalizeText(input);
    const words = normalized.split(" ").filter((w) => w.length >= 2);

    // Add full normalized string
    keywordsSet.add(normalized);

    // Add individual words
    for (const word of words) {
      keywordsSet.add(word);
    }

    // Add prefixes for partial search (max 15 chars per word)
    for (const word of words) {
      for (let i = 2; i <= Math.min(word.length, 15); i++) {
        keywordsSet.add(word.slice(0, i));
      }
    }
  }

  return Array.from(keywordsSet).slice(0, 200); // Firestore array limit safety
}
