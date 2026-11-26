// 只有工作室的收件表確認存檔後，才向填表人確認收件。
import { createHash } from "node:crypto";
import { after, NextResponse } from "next/server";
import { FORM_TAGS, sanitizePayload, summarize } from "@/app/lib/line/forms";
import { adminNotification, formReceived } from "@/app/lib/line/flex";
import { storeInquiry, notifyAdmins, push, verifyIdToken } from "@/app/lib/line/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "資料格式錯誤" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json({ ok: false, error: "資料格式錯誤" }, { status: 400 });
  }
  const { payload: input, idToken, requestId } = raw as Record<string, unknown>;
  if (typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId)) {
    return NextResponse.json({ ok: false, error: "請重新開啟表單後再送出" }, { status: 400 });
  }
  const parsed = sanitizePayload(input);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 422 });
  const { payload } = parsed;
  const user = typeof idToken === "string" ? await verifyIdToken(idToken) : null;
  if (!user) {
    return NextResponse.json({ ok: false, error: "LINE 登入已過期，請重新開啟頁面" }, { status: 401 });
  }

  // 同一份草稿重送時沿用單號；修改內容或另填一份不合併成舊單。
  const receiptId = createHash("sha256")
    .update(JSON.stringify([user.userId, requestId, payload]))
    .digest("hex");
  const receipt = await storeInquiry({
    receiptId,
    type: payload.type,
    tag: FORM_TAGS[payload.type],
    submittedAt: new Date().toISOString(),
    user: { userId: user.userId, name: user.name },
    summary: Object.fromEntries(summarize(payload)),
  });
  if (!receipt) {
    return NextResponse.json(
      { ok: false, error: "目前無法確認收件，請保留這份草稿，稍後再試。" },
      { status: 503 },
    );
  }

  if (!receipt.duplicate) {
    // 通知只是提醒，不影響已存檔的收件結果，也不因重試重複發送。
    after(async () => {
      await Promise.allSettled([
        notifyAdmins(adminNotification(payload, user)),
        push(user.userId, formReceived(payload.type)),
      ]);
    });
  }
  return NextResponse.json({ ok: true, receiptId });
}
