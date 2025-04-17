import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智遊工作室 | 讓工作更輕鬆，讓生活更自由",
  description: "我們幫助小型品牌、個人工作者、民宿、店家，把繁瑣的日常工作變得更聰明、更簡單。提供自動化流程、智能客服小幫手和工作模式規劃服務。",
  verification: {
    google: "Q3eim92P3kSmJF6ea3Ebb04rnrGa5Us36AtWsGvCrwk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
