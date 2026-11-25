import { describe, expect, it } from "vitest";
import { paginate } from "../lib/pagination";

const days = Array.from({ length: 25 }, (_, index) => `2026-11-${String(index + 1).padStart(2, "0")}`);

describe("logbook pagination", () => {
  it("shows ten entries per page", () => {
    expect(paginate(days, 0, 10).items).toHaveLength(10);
    expect(paginate(days, 2, 10).items).toEqual(days.slice(20));
  });
  it("reports the page count and clamps out-of-range pages", () => {
    expect(paginate(days, 0, 10).pageCount).toBe(3);
    expect(paginate(days, 9, 10)).toMatchObject({ page: 2, pageCount: 3 });
    expect(paginate(days, -4, 10)).toMatchObject({ page: 0, pageCount: 3 });
  });
  it("handles an empty logbook without breaking the pager", () => {
    expect(paginate([], 0, 10)).toEqual({ items: [], page: 0, pageCount: 1 });
  });
});