import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitLog · 轻量健身打卡",
  description: "记录运动、体重和腰围，简单看见自己的变化。",
  applicationName: "FitLog",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "FitLog", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#12130f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
