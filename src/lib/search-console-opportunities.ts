export type SearchConsoleOpportunityRow = {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleOpportunityPriority = "high" | "medium" | "low";

export type SearchConsoleOpportunityAction =
  | "rewrite-title-description-and-intro"
  | "add-internal-links-and-refresh-section"
  | "monitor";

export type SearchConsoleOpportunity = SearchConsoleOpportunityRow & {
  priority: SearchConsoleOpportunityPriority;
  recommendedAction: SearchConsoleOpportunityAction;
};

export function scoreSearchConsoleOpportunity(
  row: SearchConsoleOpportunityRow,
): Pick<SearchConsoleOpportunity, "priority" | "recommendedAction"> {
  if (row.impressions >= 1000 && row.ctr < 0.01 && row.position <= 12) {
    return {
      priority: "high",
      recommendedAction: "rewrite-title-description-and-intro",
    };
  }

  if (row.impressions >= 500 && row.ctr < 0.02 && row.position <= 20) {
    return {
      priority: "medium",
      recommendedAction: "add-internal-links-and-refresh-section",
    };
  }

  return {
    priority: "low",
    recommendedAction: "monitor",
  };
}

export function scoreSearchConsoleOpportunities(
  rows: SearchConsoleOpportunityRow[],
): SearchConsoleOpportunity[] {
  return rows.map((row) => ({
    ...row,
    ...scoreSearchConsoleOpportunity(row),
  }));
}
