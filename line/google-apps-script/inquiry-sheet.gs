/**
 * 選用：把 LIFF 表單自動記到 Google 試算表，當作簡易客戶名單。
 *
 * 設定方式：
 * 1. 開一份新的 Google 試算表 → 擴充功能 → Apps Script，貼上這份程式碼。
 * 2. 專案設定 → 指令碼屬性，新增 SECRET（自己取一串亂碼）。
 * 3. 部署 → 新增部署作業 → 類型選「網頁應用程式」，執行身分「我」，存取權「所有人」。
 * 4. 複製網址，在 Vercel 設定 INQUIRY_FORWARD_URL = 網址?secret=你的SECRET
 *
 * 每種表單（需求諮詢／預約諮詢／維護回報）會各自寫到同名的工作表。
 */
function doPost(e) {
  var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (secret && (!e.parameter || e.parameter.secret !== secret)) {
    return ContentService.createTextOutput('forbidden');
  }
  var body = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(body.tag) || ss.insertSheet(body.tag);
  var summary = body.summary || {};
  var keys = Object.keys(summary);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送出時間', 'LINE 名稱', 'LINE userId', '狀態'].concat(keys));
    sheet.setFrozenRows(1);
  }
  // 依現有標題欄位寫入，新欄位自動加在最後
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  keys.forEach(function (k) {
    if (header.indexOf(k) === -1) {
      header.push(k);
      sheet.getRange(1, header.length).setValue(k);
    }
  });
  var row = header.map(function (h) {
    if (h === '送出時間') return new Date(body.submittedAt);
    if (h === 'LINE 名稱') return body.user ? body.user.name : '';
    if (h === 'LINE userId') return body.user ? body.user.userId : '';
    if (h === '狀態') return '新進';
    return summary[h] || '';
  });
  sheet.appendRow(row);
  return ContentService.createTextOutput('ok');
}
