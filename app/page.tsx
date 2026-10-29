import StudioHome from "./components/studio/StudioHome";
import type { Metadata } from "next";

const title = "智遊工作室 Playwise｜宜蘭網站設計・工作流程自動化";
const description =
  "有個性的網站，懂日常的系統。智遊工作室從宜蘭出發，為民宿、小店與獨立工作者打造品牌網站、工作流程自動化與 LINE 服務。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://playwise-nine.vercel.app/" },
  openGraph: {
    title,
    description,
    url: "https://playwise-nine.vercel.app/",
    siteName: "智遊工作室 Playwise",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://playwise-nine.vercel.app/studio-share",
        width: 1200,
        height: 630,
        alt: "Playwise — Less busy. More living.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://playwise-nine.vercel.app/studio-share"],
  },
};

export default function Home() {
  return <StudioHome />;
}
