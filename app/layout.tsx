import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitLog · 轻量健身打卡",
  description: "记录训练、身体变化和饮食习惯，用趋势而不是焦虑指导下一周。",
  applicationName: "FitLog",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FitLog", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#12130f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

