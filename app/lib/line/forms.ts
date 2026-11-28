// LIFF 表單的欄位定義、驗證與摘要格式。前端（送出到聊天室的文字）與後端（通知工作室的 Flex）共用。

export type FormType = "inquiry" | "booking" | "support";

export const FORM_TAGS: Record<FormType, string> = {
  inquiry: "需求諮詢",
  booking: "預約諮詢",
  support: "維護回報",
};

export type Option = { value: string; label: string; hint?: string };

export const BUSINESS_TYPES: Option[] = [
  { value: "bnb", label: "民宿／旅宿" },
  { value: "shop", label: "店家／餐飲" },
  { value: "freelance", label: "個人工作者" },
  { value: "association", label: "協會／社群／團隊" },
  { value: "company", label: "公司／品牌" },
  { value: "other", label: "其他" },
];

export const NEEDS: Option[] = [
  { value: "website", label: "品牌網站", hint: "新官網或舊站改版" },
  { value: "richmenu", label: "LINE 圖文選單", hint: "規劃與設計" },
  { value: "liff", label: "LIFF 小程式", hint: "預約、訂單、會員、集章" },
  { value: "bot", label: "自動回覆／客服", hint: "關鍵字回覆、人工接手" },
  { value: "automation", label: "流程自動化", hint: "表單、通知、名單" },
  { value: "unsure", label: "還不確定", hint: "先聊聊再說" },
];

export const BUDGETS: Option[] = [
  { value: "lt30", label: "3 萬以下" },
  { value: "30-80", label: "3–8 萬" },
  { value: "80-150", label: "8–15 萬" },
  { value: "gt150", label: "15 萬以上" },
  { value: "unknown", label: "還不確定" },
];

export const TIMELINES: Option[] = [
  { value: "asap", label: "越快越好" },
  { value: "1-2m", label: "1–2 個月內" },
  { value: "3m", label: "3 個月內" },
  { value: "flexible", label: "時間彈性" },
];

export const CONTACT_METHODS: Option[] = [
  { value: "line", label: "LINE 文字聊就好" },
  { value: "call", label: "電話／LINE 通話" },
  { value: "meet", label: "視訊會議" },
  { value: "visit", label: "到工作室或現場聊" },
];

export const TIME_SLOTS: Option[] = [
  { value: "10-12", label: "10:00–12:00" },
  { value: "13-15", label: "13:00–15:00" },
  { value: "15-17", label: "15:00–17:00" },
  { value: "19-21", label: "19:00–21:00", hint: "晚上" },
];

export const MEETING_METHODS: Option[] = [
  { value: "call", label: "LINE 通話" },
  { value: "meet", label: "Google Meet 視訊" },
  { value: "visit", label: "到工作室（冬山）" },
];

export const SUPPORT_PROJECTS: Option[] = [
  { value: "yilanpass", label: "宜蘭旅遊通" },
  { value: "jinbnb", label: "衿日林民宿" },
  { value: "dsrpass", label: "冬山河漫遊護照" },
  { value: "other", label: "其他專案" },
];

export const SUPPORT_KINDS: Option[] = [
  { value: "content", label: "內容修改", hint: "文字、圖片、價格、公告" },
  { value: "bug", label: "功能異常", hint: "打不開、按了沒反應" },
  { value: "feature", label: "新增功能", hint: "想多做一些事" },
  { value: "account", label: "帳號／帳務", hint: "權限、發票、續約" },
];

export const URGENCY: Option[] = [
  { value: "normal", label: "一般", hint: "一週內處理即可" },
  { value: "soon", label: "盡快", hint: "影響日常營運" },
  { value: "urgent", label: "緊急", hint: "客人無法使用" },
];

export type InquiryData = {
  businessType: string;
  brandName: string;
  needs: string[];
  description: string;
  budget: string;
  timeline: string;
  contactMethod: string;
  contactName: string;
  phone: string;
};

export type BookingData = {
  date: string; // YYYY-MM-DD
  slot: string;
  method: string;
  topic: string;
  contactName: string;
  phone: string;
};

export type SupportData = {
  project: string;
  projectOther: string;
  kind: string;
  urgency: string;
  description: string;
  pageUrl: string;
  contactName: string;
};

export type FormPayload =
  | { type: "inquiry"; data: InquiryData }
  | { type: "booking"; data: BookingData }
  | { type: "support"; data: SupportData };

const label = (options: Option[], value: string) => options.find((o) => o.value === value)?.label ?? value;
const has = (options: Option[], value: string) => options.some((o) => o.value === value);
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return `${+m[2]}/${+m[3]}（${WEEKDAYS[d.getUTCDay()]}）`;
}

/** 整理、截斷使用者輸入；欄位不合法時回傳錯誤訊息。 */
export function sanitizePayload(input: unknown): { ok: true; payload: FormPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "資料格式錯誤" };
  const { type, data } = input as { type?: unknown; data?: Record<string, unknown> };
  if (!data || typeof data !== "object") return { ok: false, error: "資料格式錯誤" };

  if (type === "inquiry") {
    const needs = Array.isArray(data.needs) ? data.needs.filter((n): n is string => typeof n === "string" && has(NEEDS, n)) : [];
    const d: InquiryData = {
      businessType: str(data.businessType, 20),
      brandName: str(data.brandName, 60),
      needs: Array.from(new Set(needs)),
      description: str(data.description, 800),
      budget: str(data.budget, 20),
      timeline: str(data.timeline, 20),
      contactMethod: str(data.contactMethod, 20),
      contactName: str(data.contactName, 40),
      phone: str(data.phone, 30),
    };
    if (!has(BUSINESS_TYPES, d.businessType)) return { ok: false, error: "請選擇經營類型" };
    if (d.needs.length === 0) return { ok: false, error: "請至少選一項想做的事" };
    if (!d.contactName) return { ok: false, error: "請留下稱呼" };
    if (d.budget && !has(BUDGETS, d.budget)) d.budget = "";
    if (d.timeline && !has(TIMELINES, d.timeline)) d.timeline = "";
    if (!has(CONTACT_METHODS, d.contactMethod)) d.contactMethod = "line";
    return { ok: true, payload: { type, data: d } };
  }

  if (type === "booking") {
    const d: BookingData = {
      date: str(data.date, 10),
      slot: str(data.slot, 10),
      method: str(data.method, 10),
      topic: str(data.topic, 500),
      contactName: str(data.contactName, 40),
      phone: str(data.phone, 30),
    };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) return { ok: false, error: "請選擇日期" };
    if (!has(TIME_SLOTS, d.slot)) return { ok: false, error: "請選擇時段" };
    if (!has(MEETING_METHODS, d.method)) return { ok: false, error: "請選擇會議方式" };
    if (!d.contactName) return { ok: false, error: "請留下稱呼" };
    return { ok: true, payload: { type, data: d } };
  }

  if (type === "support") {
    const d: SupportData = {
      project: str(data.project, 20),
      projectOther: str(data.projectOther, 60),
      kind: str(data.kind, 20),
      urgency: str(data.urgency, 20),
      description: str(data.description, 1000),
      pageUrl: str(data.pageUrl, 300),
      contactName: str(data.contactName, 40),
    };
    if (!has(SUPPORT_PROJECTS, d.project)) return { ok: false, error: "請選擇專案" };
    if (!has(SUPPORT_KINDS, d.kind)) return { ok: false, error: "請選擇問題類型" };
    if (!has(URGENCY, d.urgency)) d.urgency = "normal";
    if (d.description.length < 4) return { ok: false, error: "請描述一下狀況" };
    return { ok: true, payload: { type, data: d } };
  }

  return { ok: false, error: "未知的表單類型" };
}

/** 表單摘要（標籤、值）。用於送到聊天室的文字、通知工作室的 Flex、完成頁。 */
export function summarize(payload: FormPayload): [string, string][] {
  const rows: [string, string][] = [];
  const push = (k: string, v: string) => v && rows.push([k, v]);

  if (payload.type === "inquiry") {
    const d = payload.data;
    push("經營類型", label(BUSINESS_TYPES, d.businessType));
    push("品牌名稱", d.brandName);
    push("想做的事", d.needs.map((n) => label(NEEDS, n)).join("、"));
    push("目前狀況", d.description);
    push("預算", d.budget ? label(BUDGETS, d.budget) : "");
    push("時程", d.timeline ? label(TIMELINES, d.timeline) : "");
    push("聯絡方式", label(CONTACT_METHODS, d.contactMethod));
    push("稱呼", d.contactName);
    push("電話", d.phone);
  } else if (payload.type === "booking") {
    const d = payload.data;
    push("日期", formatDate(d.date));
    push("時段", label(TIME_SLOTS, d.slot));
    push("方式", label(MEETING_METHODS, d.method));
    push("想聊什麼", d.topic);
    push("稱呼", d.contactName);
    push("電話", d.phone);
  } else {
    const d = payload.data;
    push("專案", d.project === "other" ? d.projectOther || "其他專案" : label(SUPPORT_PROJECTS, d.project));
    push("類型", label(SUPPORT_KINDS, d.kind));
    push("急迫度", label(URGENCY, d.urgency));
    push("狀況說明", d.description);
    push("相關網址", d.pageUrl);
    push("稱呼", d.contactName);
  }
  return rows;
}

/** 送到聊天室的文字（liff.sendMessages）。開頭的【標籤】讓 Webhook 認得並自動回覆確認。上限 5000 字。 */
export function chatText(payload: FormPayload): string {
  const lines = summarize(payload).map(([k, v]) => `${k}：${v}`);
  return [`【${FORM_TAGS[payload.type]}】`, ...lines].join("\n").slice(0, 4900);
}

export const CHAT_TAG_PATTERN = /^【(需求諮詢|預約諮詢|維護回報)】/;
