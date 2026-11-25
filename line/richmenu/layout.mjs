// 圖文選單的版面與動作定義：產生圖片（render.mjs）與上傳 LINE（setup.mjs）共用同一份，
// 圖上的格子和可點擊範圍一定對得上。
//
// 版型：2500 × 1686（大型），上方 200px 是兩個頁籤，用 richmenuswitch 切換。
//   A「認識智遊」給新朋友：左側大格「免費需求諮詢」＋右側 2×2
//   B「客戶專區」給已合作客戶：3×2

export const SIZE = { width: 2500, height: 1686 };
export const TAB_H = 200;
const BODY_H = SIZE.height - TAB_H; // 1486

export const TABS = [
  { id: "a", label: "認識智遊", sub: "NEW HERE" },
  { id: "b", label: "客戶專區", sub: "FOR CLIENTS" },
];

export const aliasOf = (id) => `playwise-tab-${id}`;

/**
 * @param {{ liff: (path: string) => string, site: string, tel: string, map: string }} links
 */
export function buildMenus(links) {
  const half = SIZE.width / 2;
  const tabAreas = TABS.map((t, i) => ({
    bounds: { x: i * half, y: 0, width: half, height: TAB_H },
    action: { type: "richmenuswitch", richMenuAliasId: aliasOf(t.id), data: `action=tab&to=${t.id}` },
  }));

  // A：左大格 1100 寬，右側 2×2（700 × 743）
  const colW = 700;
  const rowH = BODY_H / 2;
  const a = [
    {
      key: "inquiry",
      x: 0, y: TAB_H, w: 1100, h: BODY_H,
      featured: true,
      icon: "FiMessageCircle",
      badge: "免費・3 分鐘",
      title: "需求諮詢",
      sub: "說說你的店和想改善的事\n我們回覆適合的做法",
      cta: "開始填寫",
      action: { type: "uri", label: "需求諮詢", uri: links.liff("/inquiry") },
    },
    {
      key: "services",
      x: 1100, y: TAB_H, w: colW, h: rowH,
      icon: "FiGrid", title: "服務項目", sub: "網站・LINE・自動化",
      action: { type: "uri", label: "服務項目", uri: links.liff("/services") },
    },
    {
      key: "cases",
      x: 1800, y: TAB_H, w: colW, h: rowH,
      icon: "FiBriefcase", title: "作品案例", sub: "已上線的真實作品",
      action: { type: "postback", label: "作品案例", data: "action=cases", displayText: "作品案例" },
    },
    {
      key: "demo",
      x: 1100, y: TAB_H + rowH, w: colW, h: rowH,
      icon: "FiSmartphone", title: "體驗 LIFF", sub: "看看 LINE 能做什麼",
      tag: "互動",
      action: { type: "uri", label: "體驗 LIFF", uri: links.liff("/demo") },
    },
    {
      key: "faq",
      x: 1800, y: TAB_H + rowH, w: colW, h: rowH,
      icon: "FiHelpCircle", title: "常見問題", sub: "費用・時程・維護",
      action: { type: "postback", label: "常見問題", data: "action=faq", displayText: "常見問題" },
    },
  ];

  // B：3×2（833/834 × 743）
  const w3 = [833, 834, 833];
  const x3 = [0, 833, 1667];
  const grid = (col, row) => ({ x: x3[col], y: TAB_H + row * rowH, w: w3[col], h: rowH });
  const b = [
    {
      key: "support", ...grid(0, 0), featured: true,
      icon: "FiTool", title: "維護回報", sub: "改內容・回報問題",
      action: { type: "uri", label: "維護回報", uri: links.liff("/support") },
    },
    {
      key: "booking", ...grid(1, 0),
      icon: "FiCalendar", title: "預約諮詢", sub: "約時間聊聊",
      action: { type: "uri", label: "預約諮詢", uri: links.liff("/booking") },
    },
    {
      key: "handoff", ...grid(2, 0),
      icon: "FiHeadphones", title: "找真人聊", sub: "我們親自回覆",
      action: { type: "postback", label: "找真人聊", data: "action=handoff", displayText: "我想找真人聊聊" },
    },
    {
      key: "site", ...grid(0, 1),
      icon: "FiGlobe", title: "官方網站", sub: "作品與服務介紹",
      action: { type: "uri", label: "官方網站", uri: links.site },
    },
    {
      key: "phone", ...grid(1, 1),
      icon: "FiPhone", title: "撥打電話", sub: "0928-836-163",
      action: { type: "uri", label: "撥打電話", uri: links.tel },
    },
    {
      key: "map", ...grid(2, 1),
      icon: "FiMapPin", title: "工作室位置", sub: "宜蘭・冬山",
      action: { type: "uri", label: "工作室位置", uri: links.map },
    },
  ];

  const toRichMenu = (id, cells) => ({
    size: SIZE,
    selected: true,
    name: `playwise-${id} ${TABS.find((t) => t.id === id).label}`,
    chatBarText: "智遊選單",
    areas: [
      ...tabAreas,
      ...cells.map((c) => ({ bounds: { x: c.x, y: c.y, width: c.w, height: c.h }, action: c.action })),
    ],
  });

  return {
    a: { id: "a", tab: 0, cells: a, richMenu: toRichMenu("a", a) },
    b: { id: "b", tab: 1, cells: b, richMenu: toRichMenu("b", b) },
  };
}

/** 從環境變數組出連結（setup 與 render 共用）。 */
export function linksFromEnv(env = process.env) {
  const site = (env.NEXT_PUBLIC_SITE_URL || "https://playwise-nine.vercel.app").replace(/\/$/, "");
  const liffId = env.NEXT_PUBLIC_LIFF_ID || "";
  return {
    liffId,
    site,
    liff: (path) => (liffId ? `https://liff.line.me/${liffId}${path}` : `${site}/liff${path}`),
    tel: "tel:0928836163",
    map: "https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7",
  };
}
