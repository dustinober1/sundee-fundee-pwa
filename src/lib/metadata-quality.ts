const GENERIC_TITLES = new Set(["Blog", "FAQ", "Apps", "Roadmap"]);

export type MetadataQualityResult = {
  ok: boolean;
  score: number;
  issues: string[];
  length: number;
};

export function scoreTitle(title: string): MetadataQualityResult {
  const normalized = title.trim();
  const issues: string[] = [];
  let score = 100;

  if (GENERIC_TITLES.has(normalized)) {
    issues.push("Title is too generic.");
    score -= 60;
  }

  if (normalized.length < 30) {
    issues.push("Title is shorter than 30 characters.");
    score -= 25;
  }

  if (normalized.length > 70) {
    issues.push("Title is longer than 70 characters.");
    score -= 25;
  }

  return {
    ok: issues.length === 0,
    score: Math.max(0, score),
    issues,
    length: normalized.length,
  };
}

export function scoreMetaDescription(
  description: string,
): MetadataQualityResult {
  const normalized = description.trim();
  const issues: string[] = [];
  let score = 100;

  if (normalized.length < 110) {
    issues.push("Description is shorter than 110 characters.");
    score -= 50;
  }

  if (normalized.length > 170) {
    issues.push("Description is longer than 170 characters.");
    score -= 50;
  }

  return {
    ok: issues.length === 0,
    score: Math.max(0, score),
    issues,
    length: normalized.length,
  };
}
