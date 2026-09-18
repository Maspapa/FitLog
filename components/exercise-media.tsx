"use client";

import { useEffect, useState } from "react";
import type { LyftaExerciseMedia } from "@/lib/lyfta-links";
import { failedMedia, initialMediaState } from "@/lib/media-playback";

// Only mounted while the exercise is expanded; unmounting cancels all timers.
export function ExerciseMedia({ media, name }: { media: LyftaExerciseMedia; name: string }) {
  const [state, setState] = useState(() => initialMediaState(media.video, media.poster));
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    if (state.status !== "loading" && state.status !== "retrying") return;
    const timer = setTimeout(() => setState((current) => {
      if (current !== state) return current;
      return state.status === "retrying"
        ? { ...state, attempt: state.attempt + 1, status: "loading" }
        : failedMedia(state, Boolean(media.poster));
    }), state.status === "retrying" ? (state.attempt + 1) * 2000 : 20000);
    return () => clearTimeout(timer);
  }, [state, media.poster]);
  const update = (ready: boolean) => setState((current) => current !== state ? current : ready
    ? { ...current, status: "ready" }
    : failedMedia(current, Boolean(media.poster)));
  const active = state.status === "loading" || state.status === "ready";
  const key = `${generation}-${state.kind}-${state.attempt}`;
  return <>
    <div className="lyfta-preview">
      {active && state.kind === "video" && <video key={key} src={media.video} poster={media.poster} controls autoPlay loop muted playsInline preload="auto"
        aria-label={`${name}动态动作示范`} onCanPlay={() => update(true)} onPlaying={() => update(true)}
        onWaiting={() => setState((current) => current === state && current.status === "ready" ? { ...current, status: "loading" } : current)}
        onError={() => update(false)} />}
      {/* Native img lets us detect image failure; no image proxy or server cache. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {active && state.kind === "image" && <img key={key} className="lyfta-poster" src={media.poster} alt={`${name}动作姿势示范`} onLoad={() => update(true)} onError={() => update(false)} />}
      {state.status === "failed" && <div className="lyfta-fallback"><span>{state.kind === "none" ? "按文字步骤练习 · 原站查看指导" : "演示暂时无法加载，可查看文字或原站"}</span></div>}
      {(state.status === "loading" || state.status === "retrying") && <span className="media-loading" role="status">{state.status === "retrying" ? `稍后自动重试 ${state.attempt + 1}/2…` : "正在加载演示…"}</span>}
    </div>
    {state.kind !== "none" && <div className="media-actions"><small>{state.kind === "image" && media.video ? "视频未能加载，已切换姿势图" : state.kind === "video" ? "未自动播放时，点击视频播放按钮" : "动作姿势示范"}</small><button type="button" onClick={() => { setGeneration((value) => value + 1); setState(initialMediaState(media.video, media.poster)); }}>重新加载</button></div>}
  </>;
}
