interface CapitalizeOptions {
  /** Capitalize every word (Title Case) */
  titleCase?: boolean;
  /** When using titleCase, ignore common small words (a, an, the, and, etc.) */
  ignoreSmallWords?: boolean;
}

/**
 * Capitalizes a string.
 * - By default: capitalizes only the first letter.
 * - With `titleCase: true`: capitalizes the first letter of every word.
 */
export function toCapitalize(
  str: string | null | undefined,
  options: CapitalizeOptions = {},
): string {
  if (!str || typeof str !== "string") return "";

  const { titleCase = false, ignoreSmallWords = false } = options;

  // Simple first letter capitalization
  if (!titleCase) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Title Case logic
  const smallWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "on",
    "at",
    "to",
    "from",
    "by",
    "of",
    "in",
    "with",
  ]);

  return str
    .toLowerCase()
    .split(/\s+/) // handles multiple spaces
    .map((word, index) => {
      if (!word) return word;

      const lowerWord = word.toLowerCase();

      // Always capitalize first and last word, or if not ignoring small words
      if (index === 0 || !ignoreSmallWords || !smallWords.has(lowerWord)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      return lowerWord;
    })
    .join(" ");
}



export function insertBeforeExtension(path:string, suffix:string) {
  // Regex breakdown:
  // (\.[^.]+)$ looks for a dot followed by non-dot characters at the end of the string
  return path.replace(/(\.[^.]+)$/, `${suffix}$1`);
}