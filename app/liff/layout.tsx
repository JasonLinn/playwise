import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { LiffProvider } from "./_lib/LiffProvider";

const FONT_CSS = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap";

export const metadata: Metadata = {
  title: { default: "智遊工作室｜LINE 服務", template: "%s｜智遊工作室" },
  description: "智遊工作室 LINE 官方帳號服務：需求諮詢、預約、維護回報與作品介紹。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a73e8",
};

export default function LiffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-['Noto_Sans_TC','PingFang_TC','Microsoft_JhengHei',sans-serif] text-slate-900 antialiased">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONT_CSS} precedence="default" />
      <LiffProvider>{children}</LiffProvider>
    </div>
  );
}
