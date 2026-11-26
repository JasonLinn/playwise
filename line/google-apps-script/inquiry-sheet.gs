/**
 * 工作室 LIFF 收件表。先新增 SECRET 指令碼屬性，再將綁定在試算表的
 * Apps Script 部署為以擁有者身分執行的 Web App，見 line/README.md。
 */
function doPost(e) {
  function json(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var properties = PropertiesService.getScriptProperties();
  var secret = properties.getProperty('SECRET');
  var spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (_) {
    return json({ ok: false });
  }
  if (!secret || !spreadsheetId || !body || body.secret !== secret) return json({ ok: false });

  var tags = { inquiry: '需求諮詢', booking: '預約諮詢', support: '維護回報' };
  var tag = tags[body.type];
  if (typeof tag !== 'string' || body.tag !== tag || typeof body.receiptId !== 'string' ||
      !/^[0-9a-f]{64}$/.test(body.receiptId)) {
    return json({ ok: false });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(7000)) return json({ ok: false });
  try {
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(tag) || ss.insertSheet(tag);
    var summary = body.summary || {};
    var keys = ['收件編號'].concat(Object.keys(summary));

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['送出時間', 'LINE 名稱', 'LINE userId', '狀態'].concat(keys));
      sheet.setFrozenRows(1);
    }
    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    keys.forEach(function (key) {
      if (header.indexOf(key) === -1) {
        header.push(key);
        sheet.getRange(1, header.length).setValue(key);
      }
    });
    var rowCount = sheet.getLastRow();
    if (rowCount > 1 && sheet.getRange(2, header.indexOf('收件編號') + 1, rowCount - 1, 1)
        .createTextFinder(body.receiptId).matchEntireCell(true).findNext()) {
      return json({ ok: true, receiptId: body.receiptId, duplicate: true });
    }

    function cellText(value) {
      var text = String(value == null ? '' : value);
      return /^\s*[=+\-@]/.test(text) ? "'" + text : text;
    }
    var row = header.map(function (name) {
      if (name === '送出時間') return new Date(body.submittedAt);
      if (name === 'LINE 名稱') return cellText(body.user && body.user.name);
      if (name === 'LINE userId') return cellText(body.user && body.user.userId);
      if (name === '狀態') return '新進';
      if (name === '收件編號') return body.receiptId;
      return cellText(summary[name]);
    });
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return json({ ok: true, receiptId: body.receiptId, duplicate: false });
  } catch (_) {
    return json({ ok: false });
  } finally {
    lock.releaseLock();
  }
}
