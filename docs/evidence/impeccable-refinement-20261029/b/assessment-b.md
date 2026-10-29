# Assessment B — detector 與瀏覽器技術證據

本評估獨立執行；未讀取 Assessment A、先前報告或 snapshots。檢查對象為 `app/page.tsx` 與 `app/components/studio`，鎖定 commit `f2f9552f5d85b979c80831afd5ec790feeaa33a7`，使用父任務既有的 production build `http://localhost:3101/`。已讀本次指定的 critique/audit 參考規則。未修改應用程式、未另開伺服器、未執行 Lighthouse。

## 結論

實作有一致的品牌色、清楚的服務與原型範圍、可使用的諮詢內容準備流程。仍有 **1 項 P1、1 項 P2、1 項 P3**：聯絡區表單文字對比未達 AA；切換工作情境會無預警清除編輯中的諮詢內容；手機品牌首頁連結高 42 px，略低於 44 px 建議。detector 只有 1 個字體風格警告，並未發現前兩項真正的使用問題。

## Audit Health Score

| 維度 | 分數 | 依據 |
|---|---:|---|
| Accessibility | 2/4 | 大部分語意、焦點與狀態處理完整，但聯絡區 13–16 px 正文與 LINE 入口只有 3.81:1。 |
| Performance | 3/4（暫評） | 兩張作品圖為 next/image、具尺寸與 lazy loading；無持續動畫。未做效能量測，最終分數交父任務 Lighthouse 證據調整。 |
| Theming | 3/4 | 有明確區域 token，深色區焦點也分開定義；composer 在橘色區仍覆寫成一般 ink，造成實際 token 誤用。少量 SVG／陰影硬編碼。未宣稱有切換式 dark mode。 |
| Responsive | 3/4 | 1280/768/390/320 均無觀察到文字或控制項橫向溢出；主要操作目標至少 44 px。手機 logo 42 px，未完成真實觸控或瀏覽器 200% zoom。 |
| Implementation Integrity | 3/4 | 原型邊界與 AI 客服示範限制寫清楚；情境編輯內容重設仍是可重現的狀態缺口。 |
| **合計** | **14/20（暫評，Good）** | 最終 Performance 應以父任務效能證據覆核。 |

## 優先問題

### [P1] 聯絡區的表單說明、LINE 連結與結果訊息未達一般文字 AA 對比

- **位置**：`app/components/studio/studio.module.css:1499` `.composer` 的 `color: var(--ink)`；聯絡區背景與字色 token 定義在第 19–20 行，聯絡區原本使用正確的 `--text-on-accent`。
- **直接觀察**：橘色背景 `rgb(223,87,45)` / `#df572d`；composer 的 label、help、LINE 連結及 status 為 `rgb(41,42,37)` / `#292a25`。依 WCAG 相對亮度公式計算 **3.814:1**。label 16 px / 600、說明與 status 13 px、LINE 連結 14 px，均不能使用大型文字 3:1 門檻。
- **影響**：正要填寫或聯絡的人，必須讀取低對比的下一步與成功提示。這是 WCAG 1.4.3 AA 的實際缺口，不是單純視覺偏好。
- **狀態覆核**：成功後「已複製。開啟 LINE 後貼上，確認內容再傳送。」已在 390 px 真實瀏覽器操作出現，仍使用同一低對比色。catch 分支的錯誤訊息也共用此 status 樣式，因此原始碼支持相同對比風險；**本次沒有真的在瀏覽器拒絕 clipboard 權限，不能宣稱已實測錯誤狀態**。disabled 按鈕低對比屬停用控制項例外，不列違規。
- **建議**：只讓 contact 內 composer 的非輸入內容繼承 `--text-on-accent: #161910`，該色對橘底為 **4.691:1**；textarea 與深色複製按鈕維持各自前景色。修正後重新檢查預設、成功與拒絕複製狀態。
- **證據**：`contrast.json`、`contact.json`、`390-copy-success.png`、`768-contact.png`。
- **建議方向**：Impeccable normalize / audit（最終命令以父任務可用清單為準）。

### [P2] 切換情境會丟失使用者已編輯的諮詢內容

- **位置**：`app/components/studio/WorkflowPlayground.tsx:125`，`ConsultationBrief key={selected}`；情境按鈕第 61–62 行切換 selected 與重設 organized。
- **重現**：展開「這也是我的困擾，準備諮詢內容」，在 `#workflow-message` 填入「測試諮詢：週五整理訂單」，再按「小店經營」。textarea 立刻換成小店預設模板，剛填的內容消失，沒有保留草稿、提醒或復原入口。
- **影響**：使用者比較不同情境或誤觸鄰近按鈕時會失去輸入；這是可操作的諮詢草稿，不只是無狀態展示。
- **建議**：把草稿提升到情境父元件並按情境保留，或只在草稿尚未編輯時自動換模板；若提供「套用此情境範本」，有內容時允許明確復原。
- **證據**：`scenario-edit-result.json` 記錄切換後的小店模板、原始碼 key 可解釋狀態重建。
- **建議方向**：Impeccable harden。

### [P3] 手機品牌首頁連結高度 42 px

- **位置**：`studio.module.css:925` 起的手機 `.brand` / `.brandMark`；實際 link 約 144 × 42 px。
- **影響**：略低於 audit 的 44 × 44 px 舒適觸控建議；仍大於 AA 2.5.8 的 24 px，**不能稱為 WCAG AA 不合格**。
- **建議**：品牌連結加 min-height:44px 即可。
- **證據**：`mobile-targets-visible.json`。原始 `responsive.json` 也收錄了關閉 details 內仍可取得幾何值的導覽子元素；這些並非可見觸控目標，已排除，不能據其 33.89 px 寬判定 UI 問題。

## Detector

只執行一次：

```text
npx --yes impeccable@4.8.0 detect --json app/components/studio app/page.tsx
```

完整結果為 `detector.json`：**1 finding**，`overused-font` / warning / slop，`studio.module.css:35`，`font-family: Arial`，由五個 studio 元件引入。

判讀：Arial 的使用確實存在，但此規則是風格提示，不能單憑它認定介面是通用 AI 模板或可讀性失敗。頁面以繁體中文為主，Arial 並不涵蓋中文字形，中文會沿 Noto Sans TC / Microsoft JhengHei / 系統 fallback 渲染；目前畫面另有 serif 強調字與作品 Georgia。**不將這條 warning 升格為應修功能問題**。未驗證每個裝置實際字型是否相同。

工具回傳的 shell exit code 是 **1**，與參考文件「2 表示 findings」不同，但 stdout 是可解析且完整的單項 JSON，沒有缺少欄位或載入失敗的訊息，因此保留一次結果、不重跑 detector，也不偽稱 exit 2。執行記錄見 `run-metadata.json`。

## 瀏覽器檢查與已通過事項

- **獨立分頁**：新建 IAB tab 1；背景使用，未重用其他人分頁。使用 tab-scoped CDP Emulation 設定 1280×720、768×720、390×720、320×720，沒有使用 browser-global viewport。
- **版面**：Chrome 捲軸使 document clientWidth 分別為 1265、753、375、305；各次 scrollWidth 與 clientWidth 相等，抽樣文字與操作元件沒有越出左右邊界。320 px 截圖的 hero 兩行主標、兩個 CTA、三欄流程步驟都能閱讀；768 px 雙欄仍可用。`.site {overflow:clip}` 存在，因此不能只看 scrollWidth 就宣布無裁切；本次另檢查文字／控制項邊界與截圖。
- **觸控尺寸**：除上述 42 px logo 外，實際可見操作項目達 44 px 建議。390 px 展開選單的四項連結高 53.5 px。
- **手機選單**：點開可見四個導覽；在 summary 按 Escape 後 details 關閉，焦點回 summary，實際驗證。
- **鍵盤／語意**：單一 h1；h2→h3→h4 層次沒有跳級；header/nav/main/footer、明確的 textarea label、helper aria-describedby、原生 details/summary、aria-pressed 情境與整理按鈕、aria-live 流程結果及 role=status 複製結果都存在。FAQ「費用與製作時間怎麼估算？」以 Enter 展開，內容可讀。完整 NVDA/VoiceOver 朗讀未測，AX 中 toggle button 以 checkbox 呈現屬瀏覽器映射，沒有據此誤判原始語意。
- **圖片**：兩張作品圖載入成功、有內容導向 alt、lazy loading；未看到空白或失敗資源。
- **複製**：編輯 contact 為「本機檢查：希望整理訂單流程。」並按複製後，讀回瀏覽器 clipboard 完全相同，success status 符合下一步指示。空白字元草稿會停用複製按鈕。未按外部 LINE、未送訊息。
- **焦點**：contact 複製按鈕的實際 keyboard focus 為 `#161910` 3 px solid / offset 6 px；流程 brief summary 為 `#a83312` 3 px / offset 6 px。focus token 對紙底約 5.81:1，對 board 約 5.83:1；深底專用 `#e4f3ce` 對 `#282d27` 約 12.05:1。
- **hover**：透過 CDP mouseMoved 真正進入 hover，導覽文字 `#a53616` 對紙底約 5.83:1；流程按鈕 hover `#f3efe5` 對 `#444d3c` 約 7.71:1，未見懸停造成的新對比問題。證據 `hover-focus.json`。
- **低動態模式**：tab-scoped `prefers-reduced-motion: reduce` 實際 matches=true，ribbon animation none、task/image transition 0s。仍可點擊整理與還原，文字、背景與卡片排列狀態都改變，沒有把必要訊息一起消除；因此不將這段全域 animation/transition none 當成無條件缺陷。
- **文字排版**：主要 body 約 15–16 px，textarea 16 px；英文字眉與裝飾 caption 有 8–10 px，較細但不承擔必要操作資訊，列為可讀性 polish 而非另加 P2。未測真正瀏覽器 200% zoom 或 OS 字體放大。
- **主控台**：`tab.dev.logs({levels:['error','warn'],limit:100})` 回傳空陣列，`console.json` 已保存。這代表本次分頁收錄範圍未看到 warning/error，不是整站永無錯誤。

## 內容與能力聲稱

首頁清楚標示潮間與霧裡山房是虛構旅宿概念作品、不能實際訂房；洗衣展示列出原型能操作的數量／取送日期／明細，另列正式 LINE 登入、後台、付款及通知需評估，並說原型不建立真實訂單。LINE 與智慧客服服務下方明說目前範例僅示範訂單介面，智慧客服與人工接手另規劃。流程區也有「互動情境示範，實際串接依需求評估」。這些限制與主 CTA 相鄰且是真正文案，不是假設後台已完成。

本次只評估首頁聲稱、介面與連結設定，未把各作品路由、正式 LINE OAuth、付款、後台接單、通知傳送視為已驗證。頁面「先釐清需求，再討論做法、範圍與報價」與 FAQ 的平台／第三方服務費用說明相符，未見假價格或成果數字。

## 限制、fallback 與清理

- Read-only evaluate API 不支援可變腳本注入；依委派限制未做 document.title/script mutation、未開 live overlay server，也沒有可見的人類 overlay。fallback 為 DOM/computed style、實際 UI 操作、CDP 截圖、原始碼和單次 CLI detector。
- 截圖皆採 `Page.captureScreenshot`，clip x=0、y=當時 scrollY、width≤1280、height=720、captureBeyondViewport=false，避免自動拼接全頁。
- 嘗試合成觸控時 IAB 明確回覆 `Input.dispatchTouchEvent` 不支援；已還原 touch emulation。**沒有實際合成 tap 或實體手機觸控成功證據**，只完成窄視窗與滑鼠／鍵盤。限制記在 `touch.json`。
- `checkVisibility()` 與 `parseFloat()` 在 read-only DOM scope 不可用；改用可用的幾何、CSS 與 Number 後完成資料收集。`getByRole(button)` 無法命中 native summary，改用已觀察到的 summary locator；`body.press(Control+Home)` 不支援，改用頁面既有回到頂端連結。這些是工具限制，沒有列成產品缺陷。
- clipboard 拒絕分支僅做原始碼檢閱；父任務另負責 `scripts/verify-consultation-brief.cjs`，其結果不是本報告現有的 real-browser permission-denied 證據。
- 忽略清單 `.impeccable/critique/ignore.md` 不存在；未讀任何前次 snapshots。所有證據保存在本資料夾，無應用程式修改。
- 已清除 tab-scoped viewport/media overrides、關閉 touch emulation 並關閉自建 tab；既有 parent-owned production server 維持原狀。

## 證據檔索引

- `detector.json`、`run-metadata.json`
- `desktop-dom.json`、`contrast.json`、`contact.json`、`responsive.json`、`mobile-targets-visible.json`
- `copy-success.json`、`scenario-edit-result.json`、`focus-reduced-motion.json`、`hover-focus.json`、`faq-state.txt`、`touch.json`、`console.json`
- `desktop-hero.png`、`desktop-workflow-open.png`
- `390-hero.png`、`390-workflow.png`、`390-copy-success.png`
- `320-hero.png`、`320-workflow.png`
- `768-hero.png`、`768-workflow.png`、`768-contact.png`

本報告為供父任務在 Assessment A 完成後綜合的 B 證據，不取代獨立設計判斷。建議修正順序為 contact 對比、草稿保留、手機 logo 點擊區，最後再 polish。
