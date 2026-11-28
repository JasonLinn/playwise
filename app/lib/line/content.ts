// 智遊工作室 LINE 官方帳號與 LIFF 共用內容。
// 伺服器（Webhook 回覆的 Flex 訊息）與 LIFF 頁面都從這裡讀，改文案只要改一處。

export const STUDIO = {
  name: "智遊工作室",
  nameEn: "Playwise",
  tagline: "讓工作更輕鬆，讓生活更自由",
  phone: "0928-836-163",
  tel: "tel:0928836163",
  address: "宜蘭縣冬山鄉武淵三路120號",
  mapUrl: "https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7",
  lineAddUrl: "https://lin.ee/N4ukE55",
  // 回覆時間只用於訊息文案，實際以工作室公告為準
  hours: "週一至週五 10:00–18:00",
  replyPromise: "一個工作天內",
} as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://playwise-nine.vercel.app").replace(/\/$/, "");
export const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

/** LIFF 頁面路徑。LIFF Endpoint URL 設為 `${SITE_URL}/liff`，liff.line.me/{id}/inquiry 就會開到 /liff/inquiry。 */
export type LiffPath = "" | "/inquiry" | "/booking" | "/support" | "/services" | "/cases" | "/demo";

/** 給 LINE 訊息用的連結：有 LIFF ID 時走 liff.line.me（在 LINE 內開啟、可取得身分），否則退回一般網址。 */
export function liffUrl(path: LiffPath = "", query = ""): string {
  const q = query ? `?${query}` : "";
  return LIFF_ID ? `https://liff.line.me/${LIFF_ID}${path}${q}` : `${SITE_URL}/liff${path}${q}`;
}

export type Service = {
  id: "web" | "line" | "automation";
  title: string;
  short: string;
  description: string;
  items: string[];
  examples: string[];
  /** 主色，用在 LIFF 頁與 Flex 卡片的色塊 */
  hue: string;
};

export const SERVICES: Service[] = [
  {
    id: "web",
    title: "品牌網站設計",
    short: "民宿官網、店家網站、舊站改版",
    description:
      "把你的品牌、服務和特色整理成清楚、好看、手機也好用的網站，讓客人一進來就知道你在做什麼、怎麼聯絡你。",
    items: ["民宿官網、店家網站", "舊網站改版", "最新消息／優惠後台", "訂房與 LINE 入口整合"],
    examples: ["衿日林民宿官網"],
    hue: "#1a73e8",
  },
  {
    id: "line",
    title: "LINE 官方帳號與 LIFF",
    short: "圖文選單、LINE 登入、會員、預約、集章",
    description:
      "把 LINE 變成你的小店 App：圖文選單、自動回覆、LINE 登入領券、線上預約或訂單、GPS 集章，客人不用另外下載。",
    items: ["圖文選單規劃與設計", "LIFF 小程式（預約、訂單、會員卡）", "LINE 登入、領券、集章", "關鍵字自動回覆與人工接手"],
    examples: ["宜蘭旅遊通（LINE 登入領券）", "冬山河漫遊護照（LIFF GPS 集章）"],
    hue: "#06c755",
  },
  {
    id: "automation",
    title: "工作流程自動化",
    short: "表單、通知、名單、提醒自動跑",
    description:
      "每天都在重複做一樣的事？把表單、預約、提醒串起來，讓事情自己動起來，你把時間留給更重要的事。",
    items: ["表單送出後自動通知", "自動整理客戶名單或訂單", "固定時間發訊息、做提醒", "Google 試算表串接"],
    examples: ["洗衣廠 LINE 訂單原型"],
    hue: "#14b8a6",
  },
];

export type CaseItem = {
  name: string;
  type: string;
  summary: string;
  did: string[];
  url: string;
  image: string;
};

export const CASES: CaseItem[] = [
  {
    name: "宜蘭旅遊通",
    type: "在地旅遊平台",
    summary: "宜蘭觀光民宿行銷協會的旅遊平台，整合店家電子優惠券、合法民宿查詢與活動資訊，用 LINE 登入就能領券。",
    did: ["平台設計與開發", "LINE 登入領券", "優惠券與民宿查詢"],
    url: "https://yilanpass.com",
    image: "/images/studio/live/yilanpass.jpg",
  },
  {
    name: "衿日林民宿",
    type: "民宿官網",
    summary: "冬山河畔的包棟民宿官網，介紹房型與設施、刊登優惠與最新消息，訂房與 LINE 好友放在客人找得到的地方。",
    did: ["官網設計與開發", "最新消息後台", "訂房與 LINE 入口"],
    url: "https://jinbnb.com",
    image: "/images/studio/live/jinbnb.jpg",
  },
  {
    name: "冬山河漫遊護照",
    type: "LINE LIFF 集章",
    summary: "沿冬山河散步或騎單車的數位護照。用 LINE 開啟，旅伴角色帶路介紹每一站，到現場用 GPS 集章。",
    did: ["LINE LIFF 開發", "GPS 集章", "景點導覽頁"],
    url: "https://dsrpass.vercel.app",
    image: "/images/studio/live/dsrpass.jpg",
  },
];

export type Faq = { id: string; q: string; a: string };

export const FAQS: Faq[] = [
  {
    id: "price",
    q: "費用與製作時間怎麼估？",
    a: "依頁面內容、功能、串接項目與素材準備狀況評估。先填「需求諮詢」或直接聊聊，確認需求後提供範圍與報價；平台或第三方服務費用會分開說明。",
  },
  {
    id: "liff",
    q: "什麼是 LIFF？我的店用得到嗎？",
    a: "LIFF 是在 LINE 裡面開啟的網頁小程式，可以直接知道是哪位客人，不用另外註冊或下載 App。常見用法：線上預約、點餐訂單、會員集點、領優惠券、問卷報名。你現在點的「需求諮詢」就是一個 LIFF。",
  },
  {
    id: "oa",
    q: "已經有 LINE 官方帳號，可以幫我改圖文選單嗎？",
    a: "可以。我們會先看你的客人最常問什麼、最想讓他們做什麼，再規劃選單分區、設計圖片，必要時加上 LIFF 功能與關鍵字自動回覆。",
  },
  {
    id: "redo",
    q: "已經有網站，可以只改需要的部分嗎？",
    a: "可以先一起看現有網站，釐清內容、手機體驗與管理方式，再決定局部調整或重新製作，以及哪些素材可以沿用。",
  },
  {
    id: "tech",
    q: "我不懂技術，也沒有完整想法。",
    a: "從你每天最花時間的事情說起就好。我們會協助整理需求，說明可能的做法與限制，再一起決定優先順序。",
  },
  {
    id: "maintain",
    q: "上線之後誰來維護？",
    a: "上線時會說明日常操作方式；後續維護依約定範圍進行。已合作的客戶可以在選單「客戶專區 → 維護回報」直接送出需求。",
  },
];
