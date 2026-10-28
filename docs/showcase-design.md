# 民宿官網概念作品

兩個虛構品牌展示智遊工作室的品牌敘事、互動與響應式設計能力。
`/works/tide` 以都蘭海岸為靈感；`/works/mist` 以坪林茶山為靈感。
首屏、首頁作品卡與詢問區都明示概念性質。影像為 Unsplash 情境素材，非兩間真實民宿的實拍。

## 互動與內容邊界

- 潮間：依都蘭座標估算日出日落；潮位採週期示意模型，不能作為實際海邊活動的依據。日曆依週五、六晚的示範假日價試算；按鈕僅產生詢問預覽，不會建立訂單。
- 霧裡山房：節氣日期採固定近似日；泡茶計時器支援開始、暫停、繼續與重設；預約區只保留時段、房型、晚數與房費試算，採置中的單欄配置；已移除右側 LINE 對話、詢問卡及複製功能，不連接空房系統。
- 手機「探索」選單提供區段捷徑與返回作品集；使用原生 details/summary，支援鍵盤操作與 Escape 關閉。

## 視覺與效能

- 潮間保留海浪、潮位曲線、英文大標與海岸色彩；首屏不使用阻擋內容的全頁開場。
- 霧裡山房保留直排中文、霧層、節氣環與泡茶互動；手機不執行全屏模糊動畫與視差圖層。
- 手機的長頁區段以 content-visibility 延後排版；桌機的固定圖片與橫向捲動保持原有結構。驗收須包含錨點跳轉及回到已瀏覽區段。
- 首屏圖片 preload；字型採自託管 WOFF2。首屏標題另有微型子集，避免英文標題為了少量字母下載整個展示字型。
- 大型中文字型在頁面 load 後、瀏覽器空閒時啟用；正文有系統字型後備。
- prefers-reduced-motion 停用裝飾動畫；驗收須同時確認內容可讀與互動仍可操作。

## 修改與驗證

文案以旅宿主人接待客人的口吻撰寫：房型先說適合人數與空間差異，餐食與入住資訊直接說明安排，詢問訊息包含客人已選條件。避免每段都抒情，也不使用無依據的氣候統計、供應商合作或品牌歷史。2026-10-28 改寫範例見 [文案驗收報告](showcase-copy-review-20261028.md)。

修改文案或首屏標題後執行：

```sh
node scripts/subset-case-fonts.mjs
npm run build
node node_modules/next/dist/bin/next start -p 3188
```

首屏標題專用字型的文字定義位於 `scripts/subset-case-fonts.mjs` 的 `text` 欄位，改標題時一併更新。
字型授權原件隨附於 `public/fonts/showcases/licenses/`，來源為 Google Fonts 官方儲存庫。

效能比較固定使用 Lighthouse 12.6.1，區分預設 simulated 與實際 devtools 降速，不能混在同一前後比較中。

```sh
npx --yes lighthouse@12.6.1 http://localhost:3188/works/tide --throttling-method=devtools --chrome-flags="--headless=new" --output=json --output-path=output/tide-audit.json --quiet
```

每個最終候選版本應重複量測手機、檢查桌機，再操作日期跨月、房型人數限制、預覽、複製狀態、茶計時器、手機選單及減少動態效果。

## 品質評估

採用 [Webby 官方網站評審面向](https://www.webbyawards.com/judging-criteria/) 檢查內容、導覽、視覺、功能、互動、創新與整體體驗。
效能與無障礙工具分數是工程證據，不能替代視覺審查、實機測試或獎項評審結果。
Awwwards、FWA 是創作品質目標，本專案不宣稱已獲獎或已通過其評審。

本輪量測與畫面證據存放於 `output/showcase-review-20261028/`；摘要另見同日期的驗收報告。
