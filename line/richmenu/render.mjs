// 產生圖文選單圖片：node line/richmenu/render.mjs
// 用 React 把版面組成 HTML（圖示來自 react-icons，和網站一致），再用 Playwright 截成 2500×1686 JPEG。
// 輸出：line/richmenu/menu-a.jpg、menu-b.jpg（LINE 上限 1MB）
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Fi from "react-icons/fi";
import { createRequire } from "node:module";
import { SIZE, TAB_H, TABS, buildMenus, linksFromEnv } from "./layout.mjs";

// Playwright 用 require 載入：可用專案內安裝的版本，也可用系統全域安裝（NODE_PATH）的版本
const { chromium } = createRequire(import.meta.url)("playwright");

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FONT = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;700;900&display=block";

const TONES = {
  services: ["#e8f1fe", "#1a73e8"],
  cases: ["#e6f7f5", "#0d9488"],
  demo: ["#e7f9ee", "#06a94a"],
  faq: ["#eef0fe", "#4f46e5"],
  booking: ["#eef0fe", "#4f46e5"],
  handoff: ["#e6f7f5", "#0d9488"],
  site: ["#e8f1fe", "#1a73e8"],
  phone: ["#e7f9ee", "#06a94a"],
  map: ["#fff1e8", "#ea580c"],
};

const GAP = 16; // 卡片間距的一半
const EDGE = 30; // 外框留白

function cardBox(c) {
  const left = c.x + (c.x === 0 ? EDGE : GAP);
  const top = c.y + (c.y === TAB_H ? EDGE - 6 : GAP);
  const right = c.x + c.w - (c.x + c.w === SIZE.width ? EDGE : GAP);
  const bottom = c.y + c.h - (c.y + c.h === SIZE.height ? EDGE : GAP);
  return { left, top, width: right - left, height: bottom - top };
}

const icon = (name, size, color) => h(Fi[name], { size, color, strokeWidth: 2.1 });

function Featured({ c }) {
  const big = c.w > 1000;
  return h(
    "div",
    { className: "card featured", style: { ...cardBox(c), padding: big ? "88px 84px" : "56px 60px" } },
    h("span", { className: "ring r1" }),
    big && h("span", { className: "ring r2" }),
    h(
      "div",
      { className: "featured-inner", style: { justifyContent: big ? "space-between" : "center", alignItems: big ? "flex-start" : "center", textAlign: big ? "left" : "center" } },
      big
        ? h(
            "div",
            null,
            h("span", { className: "badge" }, c.badge),
            h("div", { className: "f-icon" }, icon(c.icon, 132, "#ffffff")),
          )
        : h("div", { className: "f-icon small" }, icon(c.icon, 120, "#ffffff")),
      h(
        "div",
        null,
        h("div", { className: big ? "f-title" : "title on-dark" }, c.title),
        h("div", { className: big ? "f-sub" : "sub on-dark" }, c.sub),
        c.cta && h("span", { className: "cta" }, c.cta, h("span", { className: "arrow" }, icon("FiArrowRight", 64, "#1a73e8"))),
      ),
    ),
  );
}

function Cell({ c }) {
  if (c.featured) return h(Featured, { c });
  const [bg, fg] = TONES[c.key] ?? ["#e8f1fe", "#1a73e8"];
  return h(
    "div",
    { className: "card", style: cardBox(c) },
    c.tag && h("span", { className: "tag", style: { color: fg, background: bg } }, c.tag),
    h("div", { className: "icon", style: { background: bg } }, icon(c.icon, 110, fg)),
    h("div", { className: "title" }, c.title),
    h("div", { className: "sub" }, c.sub),
  );
}

function Tabs({ active }) {
  return h(
    "div",
    { className: "tabs" },
    TABS.map((t, i) =>
      h(
        "div",
        { key: t.id, className: `tab ${i === active ? "active" : ""}` },
        h("span", { className: "tab-label" }, t.label),
        h("span", { className: "tab-sub" }, i === active ? t.sub : "點此切換"),
      ),
    ),
  );
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${SIZE.width}px;height:${SIZE.height}px;overflow:hidden}
body{font-family:'Noto Sans TC',sans-serif;background:#dde5ef;color:#0f172a;-webkit-font-smoothing:antialiased}
.tabs{position:absolute;inset:0 0 auto 0;height:${TAB_H}px;display:flex}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#64748b}
.tab.active{background:#f3f7fc;color:#1a73e8;border-radius:0 0 0 0}
.tab:first-child.active{border-top-right-radius:56px}
.tab:last-child.active{border-top-left-radius:56px}
.tab-label{font-size:78px;font-weight:900;letter-spacing:8px;line-height:1}
.tab-sub{font-size:32px;font-weight:700;letter-spacing:10px;opacity:.75}
.tab:not(.active) .tab-sub{letter-spacing:4px}
.body{position:absolute;left:0;right:0;top:${TAB_H}px;bottom:0;background:#f3f7fc}
.card{position:absolute;background:#fff;border-radius:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  box-shadow:0 2px 4px rgba(15,23,42,.05),0 18px 40px -22px rgba(15,23,42,.28);overflow:hidden}
.icon{width:200px;height:200px;border-radius:56px;display:flex;align-items:center;justify-content:center;margin-bottom:44px}
.title{font-size:96px;font-weight:900;letter-spacing:6px;line-height:1.1}
.sub{font-size:50px;font-weight:500;color:#64748b;margin-top:20px;letter-spacing:2px}
.on-dark{color:#fff}.sub.on-dark{color:rgba(255,255,255,.9)}
.tag{position:absolute;top:44px;right:44px;font-size:38px;font-weight:700;padding:8px 26px;border-radius:999px}
.featured{background:linear-gradient(140deg,#1a73e8 0%,#3b8ef0 45%,#14b8a6 100%);color:#fff;align-items:stretch;justify-content:stretch}
.featured-inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column}
.ring{position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.r1{width:760px;height:760px;right:-260px;bottom:-300px}
.r2{width:260px;height:260px;right:90px;top:120px}
.badge{display:inline-block;font-size:46px;font-weight:700;background:rgba(255,255,255,.2);padding:12px 36px;border-radius:999px;letter-spacing:2px}
.f-icon{width:220px;height:220px;border-radius:64px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-top:64px}
.f-icon.small{width:200px;height:200px;margin:0 0 44px}
.f-title{font-size:190px;font-weight:900;letter-spacing:12px;line-height:1.05}
.f-sub{font-size:62px;font-weight:500;line-height:1.55;margin-top:30px;white-space:pre-line;color:rgba(255,255,255,.92)}
.cta{display:inline-flex;align-items:center;gap:18px;margin-top:64px;background:#fff;color:#1a73e8;font-size:64px;font-weight:900;padding:30px 60px;border-radius:40px;letter-spacing:4px;
  box-shadow:0 20px 40px -18px rgba(8,47,102,.6)}
.arrow{display:inline-flex}
`;

function html(menu) {
  const markup = renderToStaticMarkup(
    h("div", null, h(Tabs, { active: menu.tab }), h("div", { className: "body" }), menu.cells.map((c) => h(Cell, { key: c.key, c }))),
  );
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT}"><style>${CSS}</style></head><body>${markup}</body></html>`;
}

const menus = buildMenus(linksFromEnv());
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 1 });
for (const menu of Object.values(menus)) {
  const file = path.join(DIR, `menu-${menu.id}.jpg`);
  await page.setContent(html(menu), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, type: "jpeg", quality: 90 });
  const kb = Math.round(statSync(file).size / 1024);
  console.log(`${path.relative(process.cwd(), file)}  ${kb} KB${kb > 1000 ? "  ⚠ 超過 LINE 1MB 上限" : ""}`);
}
await browser.close();
