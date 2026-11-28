// 建立並上線圖文選單（兩個頁籤 + alias + 設為預設）。
//
//   node line/richmenu/setup.mjs --dry-run   # 只印出 JSON 並向 LINE 驗證格式，不建立
//   node line/richmenu/setup.mjs             # 建立、上傳圖片、設定 alias、設為所有好友預設
//
// 需要環境變數（可放在 .env.local）：LINE_CHANNEL_ACCESS_TOKEN、NEXT_PUBLIC_LIFF_ID、NEXT_PUBLIC_SITE_URL
// 重複執行是安全的：會建立新的選單、把 alias 指過去，再刪掉舊的 playwise-* 選單。
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aliasOf, buildMenus, linksFromEnv } from "./layout.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "../..");
for (const f of [".env.local", ".env"]) {
  if (existsSync(path.join(ROOT, f))) process.loadEnvFile(path.join(ROOT, f));
}

const DRY = process.argv.includes("--dry-run");
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const links = linksFromEnv();
const menus = buildMenus(links);

if (!links.liffId) console.warn("⚠ 未設定 NEXT_PUBLIC_LIFF_ID，選單會連到一般網址（不會帶 LINE 身分，表單無法送出）。");

async function api(method, url, body, headers = {}) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(body && !(body instanceof Uint8Array) ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body instanceof Uint8Array ? body : body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}
const BOT = "https://api.line.me/v2/bot";

if (DRY) {
  for (const m of Object.values(menus)) console.log(`\n# ${m.richMenu.name}\n${JSON.stringify(m.richMenu, null, 2)}`);
  if (TOKEN) {
    for (const m of Object.values(menus)) await api("POST", `${BOT}/richmenu/validate`, m.richMenu);
    console.log("\n✓ LINE 驗證通過");
  } else console.log("\n（沒有 LINE_CHANNEL_ACCESS_TOKEN，略過線上驗證）");
  process.exit(0);
}

if (!TOKEN) {
  console.error("請先設定 LINE_CHANNEL_ACCESS_TOKEN");
  process.exit(1);
}

const { richmenus: before = [] } = await api("GET", `${BOT}/richmenu/list`);
const created = {};
for (const m of Object.values(menus)) {
  const { richMenuId } = await api("POST", `${BOT}/richmenu`, m.richMenu);
  const image = readFileSync(path.join(DIR, `menu-${m.id}.jpg`));
  await api("POST", `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, new Uint8Array(image), { "Content-Type": "image/jpeg" });
  created[m.id] = richMenuId;
  console.log(`✓ 建立 ${m.richMenu.name}：${richMenuId}`);
}

for (const [id, richMenuId] of Object.entries(created)) {
  const richMenuAliasId = aliasOf(id);
  try {
    await api("POST", `${BOT}/richmenu/alias/${richMenuAliasId}`, { richMenuId });
    console.log(`✓ 更新 alias ${richMenuAliasId}`);
  } catch {
    await api("POST", `${BOT}/richmenu/alias`, { richMenuAliasId, richMenuId });
    console.log(`✓ 建立 alias ${richMenuAliasId}`);
  }
}

await api("POST", `${BOT}/user/all/richmenu/${created.a}`);
console.log("✓ 設為所有好友的預設選單（認識智遊）");

for (const old of before) {
  if (old.name?.startsWith("playwise-") && !Object.values(created).includes(old.richMenuId)) {
    await api("DELETE", `${BOT}/richmenu/${old.richMenuId}`);
    console.log(`– 刪除舊選單 ${old.name}（${old.richMenuId}）`);
  }
}
console.log("\n完成。手機上的選單可能要重新進入聊天室才會更新。");
