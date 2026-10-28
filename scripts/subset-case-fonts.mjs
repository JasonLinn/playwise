// 為作品案例頁產生自託管子集字型。
// 修改案例頁文案後重新執行：node scripts/subset-case-fonts.mjs
//
// 1. 「首屏」字型：輸出至 public/fonts/showcases/，由各頁 preload 與樣式並行下載。
//    不把二進位塞進阻塞繪製的 CSS；重訪亦可獨立快取。授權見該目錄下 licenses/。
// 2. 「內文」字型：整頁用到的中文字子集，輸出成 woff2，由頁面在 load 之後才啟用（見各頁的 data-fonts）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'app/works/_fonts');
const PUBLIC = path.join(ROOT, 'public/fonts/showcases');

const SITES = [
    {
        site: 'tide',
        sources: ['app/works/tide/TideSite.tsx', 'app/works/tide/page.tsx'],
        // 首屏（開場、導覽列、首屏標題）會出現的中文，依字重分開
        heroText: { 500: '潮間', 300: '在潮汐之間，慢慢醒來' },
        inline: [
            { family: 'Tide Title', google: 'Instrument Serif', weight: 400, style: 'normal', text: 'Between' },
            { family: 'Tide Title', google: 'Instrument Serif', weight: 400, style: 'italic', text: 'Tides' },
            { family: 'Tide Display', google: 'Instrument Serif', weight: 400, style: 'normal' },
            { family: 'Tide Display', google: 'Instrument Serif', weight: 400, style: 'italic' },
        ],
    },
    {
        site: 'mist',
        sources: ['app/works/mist/MistSite.tsx', 'app/works/mist/page.tsx'],
        // 首屏（側欄、首屏標題、標語、提示文字、節氣名稱）會出現的中文
        heroText: {
            500: '霧裡山房',
            300:
                '坪林・北勢溪上游・三代茶農的老茶廠節氣一二三四五六霧山房一盞茶風景預約往霧裡走移動滑鼠，擦開窗上的霧用手指劃過' +
                '小寒大寒立春雨水驚蟄春分清明穀雨立夏小滿芒種夏至小暑大暑立秋處暑白露秋分寒露霜降立冬小雪大雪冬至—' +
                // 右下角浮動的作品集按鈕、h1 的完整名稱
                '智遊工作室・作品示範茶園民宿',
        },
        inline: [
            { family: 'Mist Title', google: 'Cormorant Garamond', weight: 300, style: 'normal', text: 'A tea house' },
            { family: 'Mist Title', google: 'Cormorant Garamond', weight: 400, style: 'italic', text: 'in the mist.' },
            { family: 'Mist Display', google: 'Cormorant Garamond', weight: 300, style: 'normal' },
            { family: 'Mist Display', google: 'Cormorant Garamond', weight: 400, style: 'italic' },
            { family: 'Mist Mono', google: 'IBM Plex Mono', weight: 400, style: 'normal' },
        ],
    },
];

// 讓 Google Fonts 回傳 woff2
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const isCjk = (ch) => /[⺀-鿿豈-﫿＀-￯　-〿]/.test(ch);

async function subset(family, weight, style, text) {
    const axis = style === 'italic' ? `ital,wght@1,${weight}` : `wght@${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&text=${encodeURIComponent(text)}`;
    const response = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!response.ok) throw new Error(`Font CSS request failed: ${response.status}`);
    const css = await response.text();
    const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1];
    if (!fontUrl) throw new Error(`No font URL for ${family} ${weight} ${style}:\n${css.slice(0, 300)}`);
    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) throw new Error(`Font download failed: ${fontResponse.status}`);
    const data = Buffer.from(await fontResponse.arrayBuffer());
    if (data.subarray(0, 4).toString() !== 'wOF2') throw new Error(`Expected WOFF2 for ${family}`);
    return data;
}

const face = (family, weight, style, filename) =>
    `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;` +
    `src:url('/fonts/showcases/${filename}') format('woff2')}`;

mkdirSync(OUT, { recursive: true });
mkdirSync(PUBLIC, { recursive: true });

for (const cfg of SITES) {
    const source = cfg.sources.map((s) => readFileSync(path.join(ROOT, s), 'utf8')).join('');
    const cjk = new Set([...source].filter(isCjk));
    // 英文展示字型會用到的非 ASCII 符號（° ′ – — → 等）
    const symbols = [...new Set([...source].filter((ch) => ch.codePointAt(0) > 127 && !isCjk(ch)))].join('');

    // 1. 內文：整頁中文字子集
    for (const w of [300, 500]) {
        const buf = await subset('Noto Serif TC', w, 'normal', ASCII + [...cjk].join(''));
        writeFileSync(path.join(OUT, `${cfg.site}-serif-${w}.woff2`), buf);
        console.log(`${cfg.site}-serif-${w}.woff2  ${cjk.size} 字  ${(buf.length / 1024).toFixed(1)} KB`);
    }

    // 2. 首屏：獨立檔案，由頁面 preload
    const faces = [];
    let bytes = 0;
    for (const w of [300, 500]) {
        const buf = await subset('Noto Serif TC', w, 'normal', cfg.heroText[w]);
        const filename = `${cfg.site}-hero-${w}.woff2`;
        writeFileSync(path.join(PUBLIC, filename), buf);
        faces.push(face(`${cfg.site === 'tide' ? 'Tide' : 'Mist'} Hero`, w, 'normal', filename));
        bytes += buf.length;
    }
    for (const f of cfg.inline) {
        const buf = await subset(f.google, f.weight, f.style, f.text ?? ASCII + symbols);
        const filename = `${f.family.toLowerCase().replaceAll(' ', '-')}-${f.weight}-${f.style}.woff2`;
        writeFileSync(path.join(PUBLIC, filename), buf);
        faces.push(face(f.family, f.weight, f.style, filename));
        bytes += buf.length;
    }
    const header = `/* 由 scripts/subset-case-fonts.mjs 產生，請勿手動修改 */\n`;
    writeFileSync(path.join(OUT, `${cfg.site}-fonts.css`), header + faces.join('\n') + '\n');
    console.log(`${cfg.site}-fonts.css  引用 ${faces.length} 個字型  ${(bytes / 1024).toFixed(1)} KB`);
}
