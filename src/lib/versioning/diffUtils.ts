// src/lib/versioning/diffUtils.ts
/**
 * Diff and comparison utilities for versions
 */

export const diffUtils = {
  /**
   * Create a simple text diff for string fields
   */
  diffText(oldText: string, newText: string): { removed: string[]; added: string[] } {
    if (oldText === newText) {
      return { removed: [], added: [] };
    }

    const oldLines = (oldText || "").split("\n");
    const newLines = (newText || "").split("\n");

    const removed: string[] = [];
    const added: string[] = [];

    // Simple line-based diff (could be enhanced with real diff algorithm)
    const maxLength = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLength; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];

      if (oldLine !== newLine) {
        if (oldLine !== undefined) {
          removed.push(oldLine);
        }
        if (newLine !== undefined) {
          added.push(newLine);
        }
      }
    }

    return { removed, added };
  },

  /**
   * Highlight differences in text
   */
  highlightDiff(oldText: string, newText: string): { text: string; type: "added" | "removed" | "unchanged" }[] {
    if (oldText === newText) {
      return [{ text: oldText, type: "unchanged" }];
    }

    const result: { text: string; type: "added" | "removed" | "unchanged" }[] = [];

    // Very simple character-level diff
    let i = 0;
    let j = 0;

    while (i < oldText.length || j < newText.length) {
      if (oldText[i] === newText[j]) {
        result.push({ text: oldText[i], type: "unchanged" });
        i++;
        j++;
      } else if (oldText[i]) {
        result.push({ text: oldText[i], type: "removed" });
        i++;
      } else {
        result.push({ text: newText[j], type: "added" });
        j++;
      }
    }

    return result;
  },

  /**
   * Compare two arrays
   */
  diffArrays<T>(
    oldArray: T[],
    newArray: T[]
  ): { added: T[]; removed: T[]; unchanged: T[] } {
    const added = newArray.filter((item) => !oldArray.includes(item));
    const removed = oldArray.filter((item) => !newArray.includes(item));
    const unchanged = oldArray.filter((item) => newArray.includes(item));

    return { added, removed, unchanged };
  },

  /**
   * Compare two objects and return differences
   */
  diffObjects(
    oldObj: Record<string, any>,
    newObj: Record<string, any>
  ): Record<string, { old: any; new: any }> {
    const diffs: Record<string, { old: any; new: any }> = {};

    // Check all keys from both objects
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    allKeys.forEach((key) => {
      if (oldObj[key] !== newObj[key]) {
        diffs[key] = {
          old: oldObj[key],
          new: newObj[key],
        };
      }
    });

    return diffs;
  },

  /**
   * Create a detailed HTML diff for display
   */
  createHtmlDiff(oldText: string, newText: string): string {
    const { removed, added } = this.diffText(oldText, newText);

    let html = "";

    if (removed.length > 0) {
      html += '<div class="diff-removed">';
      removed.forEach((line) => {
        html += `<div class="diff-line removed">- ${escapeHtml(line)}</div>`;
      });
      html += "</div>";
    }

    if (added.length > 0) {
      html += '<div class="diff-added">';
      added.forEach((line) => {
        html += `<div class="diff-line added">+ ${escapeHtml(line)}</div>`;
      });
      html += "</div>";
    }

    return html;
  },
};

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}
