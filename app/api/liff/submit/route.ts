// LIFF 表單送出：驗證 LINE 身分 → 通知工作室 → （選填）轉送到試算表等外部服務。
import { NextResponse } from "next/server";
import { LIFF_ID } from "@/app/lib/line/content";
import { FORM_TAGS, sanitizePayload, summarize } from "@/app/lib/line/forms";
import { adminNotification, formReceived } from "@/app/lib/line/flex";
import { forward, notifyAdmins, push, verifyIdToken, type VerifiedUser } from "@/app/lib/line/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 簡單的防連點：同一位使用者 30 秒內只收一次同類型表單（單一實例內有效，足以擋重複送出）。
const recent = new Map<string, number>();
const COOLDOWN_MS = 30_000;

export async function POST(request: Request) {
  let body: { payload?: unknown; idToken?: string; sentToChat?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "資料格式錯誤" }, { status: 400 });
  }

  const parsed = sanitizePayload(body.payload);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });
  const { payload } = parsed;

  // 有設定 LIFF ID 時一定要驗證身分；本機開發（沒有 LIFF ID）才允許匿名送出。
  let user: VerifiedUser | null = null;
  if (LIFF_ID) {
    user = await verifyIdToken(body.idToken || "");
    if (!user) return NextResponse.json({ ok: false, error: "LINE 登入已過期，請重新開啟頁面" }, { status: 401 });
  }

  const key = `${user?.userId ?? "anon"}:${payload.type}`;
  const now = Date.now();
  if ((recent.get(key) ?? 0) > now - COOLDOWN_MS) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  recent.set(key, now);
  if (recent.size > 500) for (const [k, t] of recent) if (t < now - COOLDOWN_MS) recent.delete(k);

  const who = { name: user?.name ?? "（未驗證的訪客）", userId: user?.userId };
  const [notified, forwarded] = await Promise.all([
    notifyAdmins(adminNotification(payload, who)),
    forward({
      type: payload.type,
      tag: FORM_TAGS[payload.type],
      submittedAt: new Date().toISOString(),
      user: user ? { userId: user.userId, name: user.name } : null,
      data: payload.data,
      summary: Object.fromEntries(summarize(payload)),
    }),
  ]);

  // 沒辦法把摘要送進聊天室時（例如從外部瀏覽器開啟），改用推播讓客人留有紀錄
  if (user && !body.sentToChat) await push(user.userId, formReceived(payload.type));

  return NextResponse.json({ ok: true, notified, forwarded });
}
