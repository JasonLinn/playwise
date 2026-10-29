# Assessment B — Detector、瀏覽器證據與技術稽核

Method: independent Assessment B，未讀 Assessment A 或過往設計評分。

- 日期：2026-10-29。
- 原始碼目標：`app/page.tsx` 與 `app/components/studio/`。依任務鎖定 `eb9dcb1`（程式發布為 `7f6be41`，後續僅文件）；未額外重新驗證遠端部署 SHA。
- 正式頁面：<https://playwise-nine.vercel.app/>。
- 僅首頁，未把其他作品頁或舊元件的問題併入本次結論。
- 沒有 PRODUCT.md / DESIGN.md / ignore.md；依既有實作評估。

## Implementation Integrity Verdict

**有條件通過。** 實作有一致的紙色、深墨色、橙色與流程示範語言；情境示範對應民宿、小店與接案者，概念旅宿作品有明確揭露，並提供人工接手及依需求評估的文字。未發現主要流程阻斷。確認的缺口集中在導覽 hover 對比、手機資訊字級、複製失敗指引與樣式 token 完整度；detector 的字型警告不能單獨證明設計同質化。

## Audit Health Score

| 維度 | 分數 0–4 | 證據與限制 |
|---|---:|---|
| Accessibility | 3 | 語意、焦點、鍵盤與 live region 完整；桌面導覽 hover 13px 橙色字對比 3.76:1 未達 4.5:1。未跑完整螢幕閱讀器稽核。 |
| Performance | 3 | Server 首頁搭配兩個小型 client islands；Next Image、lazy 圖片、關閉作品預取，未見重型動畫與 layout loop。歷史本機 Lighthouse 為 99；本次未重新量測線上效能。 |
| Theming | 2 | 五個基礎 CSS token 有使用，情境面板、contact、footer 等仍有大量直接色值；沒有深色模式需求，不以缺少 dark mode 扣分。 |
| Responsive Design | 3 | 320/390/768/1440 CSS px 皆無可見內容水平溢出；若干 31.5–43px 觸控高度和 9–13px 資訊字級仍可改善。 |
| Implementation Integrity | 3 | 概念標示、情境文案與可逆互動一致；複製 fallback 方位文字與實際順序不一致。 |
| **合計** | **14/20 — Good** | 工程稽核分數，不是視覺設計分數或 Lighthouse 分數。 |

確認事項數：P0 = 0、P1 = 1、P2 = 2、P3 = 2。評分依 audit 規格，WCAG AA 對比缺口列 P1；不代表整站無法使用。

## Detector 原始結果與人工核對

執行一次：

```text
npx --yes impeccable@4.8.0 detect --json app/components/studio app/page.tsx
```

- 完整 stdout：`source-detector.json`。
- 完整 stderr：`source-detector.stderr.txt`（空白）。
- Exit code：2，正常表示有 findings，不是執行失敗。
- 原始 findings **1**；rule `overused-font` **1**；severity `warning` **1**；category `slop` **1**。
- 位置：`app/components/studio/studio.module.css:9`，snippet `font-family: Arial`。同一 CSS 的 importedBy 列出 StudioHeader、StudioHome、WorkflowPlayground，不是三個獨立問題。
- 人工確認：Arial 宣告確實存在，但完整字型堆疊為 Arial / Noto Sans TC / Microsoft JhengHei / sans-serif；標題另有 Noto Serif TC / Songti TC / PMingLiU / serif（同檔 `:47`），作品英文標題另用 Georgia（`:361`）。
- **分類：保留為風格 advisory，未提升為確認 defect。** 原始碼 token 存在不是誤抓；但「Arial 因此不具個性／整頁模板化」不是 detector 能證實的結論。尤其中文呈現取決於平台可用字型，單憑 Arial 命中無法判定中文字型或整體構圖。
- 已確認的可用性問題皆由瀏覽器／原始碼核對補充，detector 未回報它們。

## 確認問題

### [P1] 桌面導覽 hover 的小字對比不足

- 位置：`app/components/studio/studio.module.css:104`、`:109`、`:110`；`StudioHeader.tsx:29`。
- 類別：Accessibility，WCAG 1.4.3 Contrast (Minimum)。
- 實測：1440px，將滑鼠移至「精選作品」後，computed style 為 `font-size: 13px; color: rgb(215,73,27)`，背景 `rgb(243,239,229)`；sRGB 對比 **3.7645:1**，小於一般文字的 4.5:1。
- 影響：低視力使用者在 hover 狀態閱讀導覽較吃力。預設墨色狀態正常。
- 修正：hover 使用較深的橙色，至少 4.5:1；也可保留墨色並以底線表示 hover，維持品牌橙色用於裝飾及大字。
- 建議命令：`impeccable harden` 或 `impeccable normalize`，依主代理已載入的可用命令清單採用。

### [P2] 手機重要說明與諮詢區字級偏小

- 位置：`studio.module.css:599`、`:995`、`:1095`、`:1133`、`:1136`、`:1175`。
- 類別：Responsive / Accessibility（閱讀品質；**不是單憑字級宣告 WCAG 違規**）。
- 320/390px 實測：hero 及服務本文 13px；概念作品免責 10px；服務細項 9px；流程卡文字 10px；「準備諮詢內容」、需求文字、複製成功回饋皆 11px。
- 影響：需判斷「這是概念展示還是實際作品」、服務範圍及是否複製成功的資訊都比主標題小很多，手機上需要更費力閱讀。見 `390-brief.png`。
- 修正：服務本文以 15–16px 起、重要說明與互動文字至少 13–14px 作視覺起點，裝飾編號和英文 eyebrow 可保留較小；調整時重驗 320px 換行。
- 建議命令：`impeccable adapt`。

### [P2] 複製失敗時指向不存在的「下方文字」

- 位置：`WorkflowPlayground.tsx:46` 與 `:133`–`:142`。
- 類別：Implementation Integrity / 錯誤恢復。
- 原始碼確認：catch 顯示「無法自動複製，請選取下方文字後複製。」；需求段落實際在複製按鈕和 status **上方**，status 下方沒有另一份可選取需求。
- 影響：當 Clipboard API 不可用或權限拒絕，訪客依指引往下找不到欲複製內容。原始需求沒有遺失，仍可手動選取。
- 實測範圍：成功路徑已點擊並看到 `role=status` 顯示「已複製。可貼到 LINE，補上你的情況。」；失敗路徑未以注入或更改權限強迫觸發，方位錯誤由 catch 文案與 DOM 順序確證。
- 修正：改為「請選取上方的需求文字後複製」，或把需求放入可選取的 readonly textarea，並讓失敗訊息直接指向該欄位。
- 建議命令：`impeccable clarify` / `impeccable harden`。

### [P3] 多處觸控區小於 44px 建議尺寸

- 位置：`studio.module.css:107`、`:253`、`:602`、`:914`、`:1157`。
- 實測：手機選單 43px 高、三個情境按鈕 43px 高、諮詢 summary 39.25px 高、hero 底部服務連結 31.5px 高（320px 換行時 35px）。桌面導覽 42.75–43.75px 高。
- 所有已量測可見控制項仍至少 24×24 CSS px；**不把小於 44px 直接誤報為 WCAG 2.5.8 AA 違規**。關閉的 details 子連結不算可見觸控區。
- 修正：在上述控制項補 `min-height: 44px`，維持現有間距。主要 CTA、LINE 與手機開啟後的導覽選項已足夠大（手機導覽 53.5px）。
- 建議命令：`impeccable adapt`。

### [P3] 區段色彩尚未完整 token 化

- 位置：`studio.module.css:457`、`:465`、`:478`、`:488`、`:494`–`:496`、`:503`、`:540`、`:565`、`:721`、`:723`、`:774`。
- 類別：Theming / 可維護性。
- 證據：基礎紙色／墨色／muted／line／orange 有 token，但深色區塊、流程卡與綠色狀態、contact 色彩和 footer 深色另以 literal 宣告；`#282d27` 同時出現在 playground 和 footer。
- 影響：未造成當下的可見故障，但日後調整對比與品牌色容易漏改；與導覽 hover 問題可一起整理。
- 修正：抽出語意 token，例如 `--surface-dark`、`--surface-board`、`--state-organized`、`--accent-text`；無需為此新增深色模式。
- 建議命令：`impeccable normalize`。

## 瀏覽器證據與已排除誤報

- 使用獨立 IAB tab，全程由 `mcp__cua_repl` 控制，CDP override 僅作用於該 tab。視窗保持背景。
- 320/390/768/1440px 的 `documentElement.scrollWidth === clientWidth`，實測分別 305/375/753/1425px；15px 差異為此桌面 Chromium 的捲軸，非內容溢出。排除裝飾性 `aria-hidden` 圖形後，可見 main 元素沒有越過內容邊界。證據：`verified-metrics.json`。
- `browser-metrics.json` 為初始原始量測，讀取 bounding rect 時也列入關閉 details 的子節點，這些尺寸是**量測假陽性**；已人工核對並在 `verified-metrics.json` 排除，未當作網站 bug。
- 手機選單以 Enter 開啟，Tab 到第一個連結，焦點有 3px outline；Escape 關閉並返回 summary。`StudioHeader.tsx:48`–`:51` 與瀏覽器行為一致。
- 情境按鈕有可及名稱與 `aria-pressed`；選「小店經營」後內容更新，再用 Enter 切換理順狀態，文案、步驟與按鈕狀態一起改變。`WorkflowPlayground.tsx:65`–`:75`、`:109`–`:127`。
- 諮詢 details 可鍵盤展開，複製成功文字以 `role=status` 呈現。LINE 連結可及名稱清楚，本次未開啟 LINE、未對外傳訊。
- 無名稱缺失的主要連結／按鈕。作品卡可及名稱較長，但包含作品名稱、概念標示與目的，未列為嚴重問題。圖片有描述性 alt，頁面 lang 是 zh-TW。
- `prefers-reduced-motion: reduce` 下，ribbon animation 為 none、task transition 為 0s；實際切換仍更新文字、pressed 狀態與 task 排列。因此雖是廣域移除動畫規則，**沒有證據顯示它破壞必要回饋**，不報 bug。證據：`reduced-motion.json`。
- 以 computed colors 計算一般可見 leaf 文字，預設狀態未發現小字低於 4.5:1；hero 橙字為 32px，3.76:1 **達大字 3:1**，不是違規。hover 導覽另行實測後確認為問題。`contrast-inputs.json`、`contrast-results.json`。
- 本次 error/warn console 無回報；`console.json` 為空陣列。這不等於已證明所有網路或 runtime 情況無錯誤。
- 截圖工具限制：超過 IAB 原生 1280×720 surface 時曾出現重複圖塊，已排除為擷取偽影，未判成網站故障。最終 `320-top.png`、`390-top.png`、`768-top.png` 為有效 720px 高擷取；`1440-top.png` 是 **1440px 版面的左側 1280×720 裁切**，完整寬度以 DOM 量測佐證。`390-brief.png` 記錄諮詢成功狀態。
- 實際操作以 Chromium 桌面引擎縮窄 viewport 與鍵盤／滑鼠合成完成，**未測真實手機觸控、Safari、螢幕閱讀器語音或完整 200% 文字縮放**。首頁沒有拖曳／滑桿手勢，因此未假裝 viewport 測試已證明 gesture 相容性。

## 歷史效能佐證（未重跑）

允許讀取的原始 `output/studio-20261029/mobile-45d57c4.json` 記錄：2026-10-29T10:44:22.291Z、`http://localhost:3101/`，Performance **99**、Accessibility **100**、LCP 約 **2.20s**、TBT **18ms**、CLS **0**。這是歷史本機測試，**不是本次正式網址的新測試**，也不是設計品質 99/100。沒有使用過往設計自評。

## 正向實作

- 首頁透過 server component 組合，只有手機導覽與情境示範需要 client state；沒有為純呈現內容引入大型互動依賴。
- Next Image 帶 alt、sizes、靜態尺寸，已觀察圖片 loading=lazy；作品 Link `prefetch={false}` 避免首頁預先載入各作品互動程式。
- 原生 details/summary、skip link、main/section heading、明確焦點樣式、aria-live/status、概念作品揭露、可逆示範狀態都有實際用途。

## Run Notes

- CLI detector：成功執行一次，輸出完整保存；不需 parent 重跑。
- Overlay：**unavailable / read-only evaluate fallback**。本環境 evaluate 僅可唯讀，未嘗試注入 script、修改 document.title 或繞過限制；沒有可靠的人類可見 overlay。
- Browser console detector findings：不適用，未注入 detector。
- Live server：未啟動，因此無待清理 server。
- Browser cleanup：已清除本 tab device metrics override、重設 reduced-motion emulation，關閉自建分頁。
- Artifact cleanup：保留證據檔供覆核；未改官網原始碼、未部署、未傳送外部訊息。
- Questions skipped: Assessment B 子任務要求不提問；由主代理綜合 A/B 後處理使用者問題。
- 建議順序：先修 hover 對比，再處理手機字級與 fallback，最後 token／觸控微調，修正後重跑 audit，並以 `impeccable polish` 收尾；可用命令名稱需由主代理對照正式清單。
