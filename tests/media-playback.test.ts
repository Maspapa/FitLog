import { describe, expect, it } from "vitest";
import { failedMedia, initialMediaState } from "../lib/media-playback";

describe("exercise media recovery", () => {
  it("prefers video, then image, and handles missing media", () => {
    expect(initialMediaState("video", "image").kind).toBe("video");
    expect(initialMediaState(undefined, "image").kind).toBe("image");
    expect(initialMediaState().status).toBe("failed");
  });
  it("retries twice before falling back to image", () => {
    const state = initialMediaState("video", "image");
    expect(failedMedia(state, true).status).toBe("retrying");
    expect(failedMedia({ ...state, attempt: 1 }, true).status).toBe("retrying");
    expect(failedMedia({ ...state, attempt: 2 }, true)).toEqual({ kind: "image", attempt: 0, status: "loading" });
  });
  it("stops after exhausted retries and ignores repeated errors", () => {
    const state = { ...initialMediaState("video"), attempt: 2 };
    expect(failedMedia(state, false).status).toBe("failed");
    expect(failedMedia({ ...state, kind: "image" }, true).status).toBe("failed");
    const waiting = failedMedia(initialMediaState("video"), false);
    expect(failedMedia(waiting, false)).toBe(waiting);
  });
});
