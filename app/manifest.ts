import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitLog 轻量健身打卡",
    short_name: "FitLog",
    description: "每天一分钟，记录训练和身体趋势。",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f0e8",
    theme_color: "#12130f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

