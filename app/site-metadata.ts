import type { Metadata } from "next";

export const siteOrigin = "https://playwise-nine.vercel.app";

type PageInfo = {
  title: string;
  description: string;
  image?: string;
};

export const publicPages = {
  "/": {
    title: "智遊工作室 Playwise｜宜蘭網站設計・工作流程自動化",
    description: "有個性的網站，懂日常的系統。智遊工作室從宜蘭出發，為民宿、小店與獨立工作者打造品牌網站、工作流程自動化與 LINE 服務。",
  },
  "/line": {
    title: "加入智遊工作室 LINE 好友｜服務諮詢",
    description: "掃描 QR 碼或點選連結，加入智遊工作室 LINE 好友，洽詢品牌網站設計、LINE 客服與工作流程自動化服務。",
  },
  "/works/bnb": {
    title: "日式民宿官網設計示範｜智遊工作室",
    description: "以宜蘭檜木森林為靈感的虛構旅宿官網，展示日式版面、互動房型介紹、交通位置與周邊景點。",
  },
  "/works/laundry": {
    title: "洗衣廠 LINE LIFF 訂單系統互動示範｜智遊工作室",
    description: "體驗顧客在 LINE 選擇送洗品項、查看費用與預約取送的流程。這是前端互動示範，操作不會建立實際訂單。",
    image: "/images/studio/live/laundry-liff.jpg",
  },
  "/works/mist": {
    title: "霧裡山房 Mist House｜坪林茶宿官網概念設計｜智遊工作室",
    description: "以坪林茶山為靈感的虛構民宿官網設計。體驗霧氣互動、節氣環、泡茶計時器與預約詢問示範。",
    image: "/images/studio/mist.jpg",
  },
  "/works/tide": {
    title: "潮間 Between Tides｜台東都蘭海邊民宿官網概念設計｜智遊工作室",
    description: "以台東都蘭海岸為靈感的虛構民宿官網設計。探索潮位示意、日出日落估算、一日行程與訂房詢問預覽。",
    image: "/images/studio/tide.jpg",
  },
  "/works/washpass": {
    title: "洗務通 WashPass｜民宿布巾送洗預約與廠端排程系統｜智遊工作室",
    description: "查看洗務通如何串接民宿的 LINE 送洗預約與洗被單廠後台，從批次審核、行事曆排程到取送安排。",
  },
} satisfies Record<string, PageInfo>;

export function pageMetadata(path: keyof typeof publicPages): Metadata {
  const { title, description, image }: PageInfo = publicPages[path];
  const url = new URL(path, siteOrigin).href;
  const images = image ? [image] : [{
    url: "/studio-share",
    width: 1200,
    height: 630,
    alt: "Playwise — Less busy. More living.",
  }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "智遊工作室 Playwise",
      locale: "zh_TW",
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
