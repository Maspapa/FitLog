export type MediaState = { kind: "video" | "image" | "none"; attempt: number; status: "loading" | "ready" | "retrying" | "failed" };
export function initialMediaState(video?: string, poster?: string): MediaState {
  return { kind: video ? "video" : poster ? "image" : "none", attempt: 0, status: video || poster ? "loading" : "failed" };
}
export function failedMedia(state: MediaState, hasPoster: boolean): MediaState {
  if (state.status === "retrying" || state.status === "failed") return state;
  if (state.attempt < 2) return { ...state, status: "retrying" };
  if (state.kind === "video" && hasPoster) return { kind: "image", attempt: 0, status: "loading" };
  return { ...state, status: "failed" };
}
