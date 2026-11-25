// 伺服器端 LINE API 小工具（不依賴 SDK，直接用 fetch）。只能在 Route Handler 等伺服器程式碼使用。
import { createHmac, timingSafeEqual } from "node:crypto";
import { LIFF_ID } from "./content";

const API = "https://api.line.me";

export const lineEnv = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
  accessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  /** LIFF 所在的 LINE Login channel ID。LIFF ID 的前半段就是 channel ID，通常不用另外設定。 */
  loginChannelId: process.env.LINE_LOGIN_CHANNEL_ID || LIFF_ID.split("-")[0] || "",
  /** 收到表單或「找真人」時要通知的對象（userId 或 groupId，可用逗號分隔多個）。 */
  adminTo: (process.env.LINE_ADMIN_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  /** 選填：同時把表單 POST 到這個網址（例如 Google Apps Script → 試算表當客戶名單）。 */
  forwardUrl: process.env.INQUIRY_FORWARD_URL || "",
  /** 測試用：設為 1 時不真的呼叫 LINE API，只把要送的訊息印在 log。 */
  dryRun: process.env.LINE_API_DRY_RUN === "1",
};

export function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!lineEnv.channelSecret || !signature) return false;
  const expected = createHmac("sha256", lineEnv.channelSecret).update(rawBody).digest();
  let given: Buffer;
  try {
    given = Buffer.from(signature, "base64");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// LINE 訊息物件的結構很大，這裡只做寬鬆型別，細節依官方文件。
export type LineMessage = Record<string, unknown> & { type: string };

async function call(path: string, body: unknown): Promise<boolean> {
  if (lineEnv.dryRun) {
    console.info(`[line:dry-run] POST ${path}\n${JSON.stringify(body, null, 2)}`);
    return true;
  }
  if (!lineEnv.accessToken) {
    console.warn(`[line] LINE_CHANNEL_ACCESS_TOKEN 未設定，略過 ${path}`);
    return false;
  }
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lineEnv.accessToken}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`[line] ${path} ${res.status}: ${await res.text().catch(() => "")}`);
    return false;
  }
  return true;
}

export function reply(replyToken: string, messages: LineMessage[]) {
  return call("/v2/bot/message/reply", { replyToken, messages: messages.slice(0, 5) });
}

export function push(to: string, messages: LineMessage[]) {
  return call("/v2/bot/message/push", { to, messages: messages.slice(0, 5) });
}

export async function notifyAdmins(messages: LineMessage[]): Promise<boolean> {
  if (lineEnv.adminTo.length === 0) {
    console.warn("[line] LINE_ADMIN_TO 未設定，工作室不會收到通知");
    return false;
  }
  const results = await Promise.all(lineEnv.adminTo.map((to) => push(to, messages)));
  return results.some(Boolean);
}

export async function getProfile(userId: string): Promise<{ displayName: string; pictureUrl?: string } | null> {
  if (!lineEnv.accessToken || lineEnv.dryRun) return null;
  const res = await fetch(`${API}/v2/bot/profile/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${lineEnv.accessToken}` },
  }).catch(() => null);
  return res?.ok ? res.json() : null;
}

export type VerifiedUser = { userId: string; name: string; picture?: string };

/** 驗證 LIFF 前端送來的 ID token，確認是哪位 LINE 使用者。 */
export async function verifyIdToken(idToken: string): Promise<VerifiedUser | null> {
  if (!lineEnv.loginChannelId || !idToken) return null;
  const res = await fetch(`${API}/oauth2/v2.1/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: lineEnv.loginChannelId }),
  }).catch(() => null);
  if (!res?.ok) return null;
  const data = (await res.json()) as { sub?: string; name?: string; picture?: string };
  return data.sub ? { userId: data.sub, name: data.name || "LINE 使用者", picture: data.picture } : null;
}

export async function forward(payload: unknown): Promise<boolean> {
  if (!lineEnv.forwardUrl) return false;
  const res = await fetch(lineEnv.forwardUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((e) => {
    console.error("[line] forward failed", e);
    return null;
  });
  return Boolean(res?.ok);
}
