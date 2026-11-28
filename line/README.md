# 智遊工作室 LINE 官方帳號：上線設定步驟

規劃與設計說明見 [docs/line-oa-liff-20261125.md](../docs/line-oa-liff-20261125.md)。這份只講「怎麼把它開起來」。

## 這個資料夾

| 檔案 | 用途 |
|---|---|
| `richmenu/layout.mjs` | 圖文選單的版面與點擊動作（產圖與上傳共用，格子一定對得上） |
| `richmenu/render.mjs` | 產生選單圖片 → `richmenu/menu-a.jpg`、`menu-b.jpg` |
| `richmenu/setup.mjs` | 呼叫 LINE API 建立選單、上傳圖片、設定頁籤 alias、設為預設 |
| `google-apps-script/inquiry-sheet.gs` | 正式收件：表單寫入 Google 試算表後回傳收件編號 |

程式碼在 `app/liff/`（LIFF 頁面）、`app/api/line/webhook`（自動回覆）、`app/api/liff/submit`（表單送出）、`app/lib/line/`（共用文案、表單、訊息）。

## 一、LINE Developers 設定（約 15 分鐘）

1. **Messaging API channel**（就是現在的官方帳號 `lin.ee/N4ukE55`）
   - Basic settings → 複製 **Channel secret** → `LINE_CHANNEL_SECRET`
   - Messaging API → 發行 **Channel access token (long-lived)** → `LINE_CHANNEL_ACCESS_TOKEN`
   - Messaging API → Webhook URL 填 `https://playwise-nine.vercel.app/api/line/webhook`，打開 **Use webhook**，按 Verify 應該顯示 Success
2. **LINE Login channel**（同一個 Provider 底下新建，LIFF 要掛在這裡）
   - LIFF 分頁 → Add
     - Size：**Full**（掃 QR Code 需要 Full）
     - Endpoint URL：`https://playwise-nine.vercel.app/liff`
     - Scopes：勾 `openid`、`profile`、`chat_message.write`
     - Bot link feature：**On (Aggressive)**（讓沒加好友的人打開時順便加好友）
     - Scan QR：開啟
   - 複製 **LIFF ID** → `NEXT_PUBLIC_LIFF_ID`
   - 記得把 Login channel 從 Developing 改成 **Published**，不然只有開發者能登入
3. **LINE Official Account Manager**（manager.line.biz）→ 設定 → 回應設定
   - 回應方式：**聊天**（保留真人回覆）＋ **Webhook 開啟**
   - **自動回應訊息關閉**、**加入好友的歡迎訊息關閉**（改由 Webhook 回覆，避免回兩次）
   - 原本在後台做的圖文選單，等新的上線後可以刪掉

## 二、Vercel 環境變數

照 [`.env.example`](../.env.example) 填到 Vercel → Settings → Environment Variables，重新部署。

`LINE_ADMIN_TO` 先留空：部署完成後，用你自己的 LINE 在官方帳號聊天室傳 `#myid`，會回覆你的 userId，填進去再部署一次。想讓多人收到通知，可以把官方帳號拉進工作室群組，在群組裡傳 `#myid` 取得 groupId。

### 先設定正式收件表

1. 建立工作室專用的私人試算表，僅授權負責收件的人。從「擴充功能 → Apps Script」貼上 `google-apps-script/inquiry-sheet.gs`。
2. 在指令碼屬性設 `SECRET`（使用長且隨機的密鑰）和 `SPREADSHEET_ID`（試算表網址中 /d/ 和下一個斜線之間的 ID）。部署為 Web App，以擁有者身分執行，允許服務端存取；腳本會拒絕未提供密鑰的請求。
3. 將 `/exec` 網址（不帶 query secret）設為伺服器端的 `INQUIRY_FORWARD_URL`，並在 `INQUIRY_FORWARD_SECRET` 填同一密鑰。若曾設定舊版含密鑰的網址，請移除 query 並換新密鑰。既有部署更新腳本後要建立新部署版本。
4. 沒有收件表或無法確認已寫入時，表單顯示失敗並保留草稿。LINE 通知只是提醒，不是收件依據。不要用真實客資驗證 Preview，請使用獨立的測試試算表。

## 三、上線圖文選單

```bash
# 1. 在本機建立 .env.local，填 LINE_CHANNEL_ACCESS_TOKEN、NEXT_PUBLIC_LIFF_ID
# 2.（改過文案或版面才需要）重新產生圖片
node line/richmenu/render.mjs
# 3. 先檢查，再正式建立
node line/richmenu/setup.mjs --dry-run
node line/richmenu/setup.mjs
```

重複執行是安全的：會建新的選單、把頁籤 alias 指過去，再刪掉舊的 `playwise-*` 選單。手機上要重新進入聊天室才會看到新選單。

## 四、上線後檢查清單

- [ ] 加好友（或封鎖再解除）→ 收到歡迎卡片
- [ ] 圖文選單上方頁籤可以在「認識智遊／客戶專區」切換
- [ ] 每一格都點一次：LIFF 頁面能開、作品案例跳出輪播卡、常見問題跳出選項、找真人有回覆
- [ ] 從 LINE 內和外部瀏覽器登入，各用假資料送一份需求諮詢。工作室試算表須各收到一筆，畫面才顯示「已收到」。確認送出前不會把表單摘要發進當前聊天室。
- [ ] 在測試環境停用收件表，送出應顯示無法確認收件，重新開啟後資料還在；復原後重送，只寫入一筆。
- [ ] 若有設定 `LINE_ADMIN_TO`，另驗證工作室有收到通知；不影響收件表的結果。
- [ ] 傳「多少錢」「作品」「服務」→ 有對應回覆；傳一般聊天內容 → 不自動回覆（留給真人）
- [ ] 在 OA Manager 聊天室可以正常手動回覆

## 本機開發

```bash
npm run dev
# 開 http://localhost:3000/liff ——沒設 LIFF ID 時是「預覽模式」，可走完整個流程但不會送出
```

測 Webhook 可以設 `LINE_API_DRY_RUN=1`，回覆內容會印在終端機而不是送到 LINE。
