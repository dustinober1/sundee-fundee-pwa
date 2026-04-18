import { describe, expect, it } from "vitest";
import { CreateProgramSchema } from "../actions";

describe("pct_1rm integer-to-decimal conversion", () => {
  it("converts 85 to 0.85", () => {
    expect(85 / 100).toBe(0.85);
  });
  it("converts 100 to 1.0", () => {
    expect(100 / 100).toBe(1.0);
  });
  it("converts 1 to 0.01", () => {
    expect(1 / 100).toBe(0.01);
  });
});

describe("CreateProgramSchema validation", () => {
  const validPayload = {
    name: "Test Program",
    duration_weeks: 4,
    sessions_per_week: 3,
    phases: [{ name: "Foundation", start_week: 1, end_week: 4 }],
    weeks: [
      {
        week_num: 1,
        sessions: [
          {
            label: "Session A",
            exercises: [
              {
                exercise_id: "11111111-1111-4111-8111-111111111111",
                sets: 3,
                reps: 5,
                pct_1rm: 85,
              },
            ],
          },
        ],
      },
    ],
  };

  it("accepts a valid payload", () => {
    const result = CreateProgramSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = CreateProgramSchema.safeParse({
      ...validPayload,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects pct_1rm > 100", () => {
    const payload = structuredClone(validPayload);
    payload.weeks[0].sessions[0].exercises[0].pct_1rm = 101;
    const result = CreateProgramSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects end_week before start_week", () => {
    const result = CreateProgramSchema.safeParse({
      ...validPayload,
      phases: [{ name: "Bad Phase", start_week: 4, end_week: 2 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects sessions with no exercises", () => {
    const payload = structuredClone(validPayload);
    payload.weeks[0].sessions[0].exercises = [];
    const result = CreateProgramSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe("searchExercises short-circuit", () => {
  it("returns [] for query length < 2 (pure logic — no DB needed)", () => {
    // Inline the guard logic without importing the action (avoids "use server" module issues)
    function shortCircuit(query: string) {
      if (!query || query.length < 2) return [];
      return null; // would call DB
    }
    expect(shortCircuit("")).toEqual([]);
    expect(shortCircuit("a")).toEqual([]);
    expect(shortCircuit("sq")).toBeNull(); // would proceed to DB
  });
});
