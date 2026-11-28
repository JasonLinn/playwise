// LINE Messaging API Webhook：加好友歡迎、圖文選單 postback、關鍵字自動回覆、找真人通知。
// 沒有對應關鍵字的訊息不自動回覆，留給工作室在聊天室親自回覆。
import { NextResponse } from "next/server";
import { CHAT_TAG_PATTERN, FORM_TAGS, type FormType } from "@/app/lib/line/forms";
import * as msg from "@/app/lib/line/flex";
import { getProfile, lineEnv, notifyAdmins, reply, verifySignature, type LineMessage } from "@/app/lib/line/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { type: string; userId?: string; groupId?: string; roomId?: string };
  message?: { type: string; text?: string };
  postback?: { data: string };
};

const KEYWORDS: [RegExp, (e: LineEvent) => LineMessage[] | Promise<LineMessage[]>][] = [
  [/真人|客服|專人|人工|找人/, (e) => doHandoff(e)],
  [/常見問題|^faq$|^q&?a$/i, () => msg.faqMenu()],
  [/費用|價格|價錢|報價|多少錢|預算|收費/, () => msg.faqAnswer("price")],
  [/liff/i, () => msg.faqAnswer("liff")],
  [/圖文選單|官方帳號/, () => msg.faqAnswer("oa")],
  [/維護|改版|修改網站/, () => msg.faqAnswer("maintain")],
  [/服務|項目|你們做什麼|可以做什麼/, () => msg.services()],
  [/作品|案例|做過/, () => msg.cases()],
  [/電話|地址|在哪|位置|營業時間|聯絡/, () => msg.contact()],
  [/^(你好|您好|哈囉|嗨|hi|hello)/i, () => msg.welcome()],
];

async function displayName(e: LineEvent) {
  const id = e.source?.userId;
  return (id && (await getProfile(id))?.displayName) || "LINE 好友";
}

async function doHandoff(e: LineEvent) {
  await notifyAdmins(msg.handoffNotice(await displayName(e)));
  return msg.handoff();
}

async function handlePostback(e: LineEvent): Promise<LineMessage[] | null> {
  const params = new URLSearchParams(e.postback?.data || "");
  switch (params.get("action")) {
    case "services":
      return msg.services();
    case "cases":
      return msg.cases();
    case "faq":
      return params.get("id") ? msg.faqAnswer(params.get("id")!) : msg.faqMenu();
    case "contact":
      return msg.contact();
    case "handoff":
      return doHandoff(e);
    case "tab": // 圖文選單切換頁籤（richmenuswitch）也會送 postback，不需要回覆
    default:
      return null;
  }
}

async function handleText(e: LineEvent): Promise<LineMessage[] | null> {
  const raw = (e.message?.text || "").trim();
  if (!raw) return null;

  // LIFF 表單送到聊天室的摘要 → 回覆確認（通知工作室由 /api/liff/submit 處理）
  const tag = CHAT_TAG_PATTERN.exec(raw)?.[1];
  if (tag) {
    const type = (Object.keys(FORM_TAGS) as FormType[]).find((k) => FORM_TAGS[k] === tag)!;
    return msg.formReceived(type);
  }

  // 設定用：查自己的 userId，填到 LINE_ADMIN_TO。設定好之後只回覆給管理員本人。
  if (/^#(myid|我的id)$/i.test(raw)) {
    const id = e.source?.groupId || e.source?.userId || "";
    if (lineEnv.adminTo.length && !lineEnv.adminTo.includes(id)) return null;
    return [msg.text(`這個對話的 ID：\n${id}\n\n把它填到環境變數 LINE_ADMIN_TO，就能收到表單通知。`)];
  }

  // 群組裡不做關鍵字回覆（避免干擾工作室群組）
  if (e.source?.type !== "user") return null;

  const normalized = raw.replace(/\s+/g, "");
  for (const [pattern, handler] of KEYWORDS) {
    if (pattern.test(normalized)) return handler(e);
  }
  return null;
}

async function handleEvent(e: LineEvent) {
  if (!e.replyToken) return;
  let messages: LineMessage[] | null = null;
  if (e.type === "follow") messages = msg.welcome(await displayName(e));
  else if (e.type === "postback") messages = await handlePostback(e);
  else if (e.type === "message" && e.message?.type === "text") messages = await handleText(e);
  if (messages?.length) await reply(e.replyToken, messages);
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get("x-line-signature"))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  let events: LineEvent[] = [];
  try {
    events = (JSON.parse(raw) as { events?: LineEvent[] }).events ?? [];
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  // LINE Developers 的「Verify」按鈕會送空的 events，直接回 200
  const results = await Promise.allSettled(events.map(handleEvent));
  results.forEach((r) => r.status === "rejected" && console.error("[line:webhook]", r.reason));
  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: true, service: "playwise line webhook" });
}
