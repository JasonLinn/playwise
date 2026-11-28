// Test the real Apps Script handler with an in-memory spreadsheet. No accounts or customer data.
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { createContext, runInContext } = require("node:vm");
const rows = [];
let locked = false, allowWrite = true, flushes = 0, lockAvailable = true;
const props = { SECRET: "local-test-secret", SPREADSHEET_ID: "local-test-sheet" };
const sheet = {
  getLastRow: () => rows.length,
  getLastColumn: () => rows[0]?.length ?? 0,
  appendRow(row) {
    assert(locked);
    if (!allowWrite && rows.length) throw Error("simulated write failure");
    rows.push(Array.from(row));
  },
  setFrozenRows() {},
  getRange(row, col, height, width) {
    return {
      getValues: () => [rows[row - 1].slice(col - 1, col - 1 + width)],
      setValue: value => { rows[row - 1][col - 1] = value; },
      createTextFinder: text => ({
        matchEntireCell(entire) {
          assert.equal(entire, true);
          return { findNext: () => rows.slice(row - 1, row - 1 + height).find(r => r[col - 1] === text) };
        },
      }),
    };
  },
};
const ctx = createContext({
  PropertiesService: { getScriptProperties: () => ({ getProperty: key => props[key] }) },
  ContentService: { createTextOutput: text => ({ setMimeType: () => text }), MimeType: { JSON: "application/json" } },
  SpreadsheetApp: {
    openById(id) {
      assert.equal(id, props.SPREADSHEET_ID);
      return { getSheetByName: () => sheet };
    },
    flush() { assert(locked); flushes++; },
  },
  LockService: { getScriptLock: () => ({
    tryLock() { assert(!locked); return (locked = lockAvailable); },
    releaseLock() { assert(locked); locked = false; },
  }) },
});
runInContext(readFileSync(new URL("../line/google-apps-script/inquiry-sheet.gs", `file://${__filename}`), "utf8"), ctx);
const receiptId = "a".repeat(64);
const body = { secret: props.SECRET, receiptId, type: "inquiry", tag: "需求諮詢",
  submittedAt: new Date().toISOString(), user: { name: "測試", userId: "U-test" }, summary: { 內容: "測試資料" } };
const post = value => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(value) } }));
assert.deepEqual(post({ ...body, secret: "bad" }), { ok: false });
assert.deepEqual(post({ ...body, tag: "other" }), { ok: false });
lockAvailable = false;
assert.deepEqual(post(body), { ok: false });
assert.equal(rows.length, 0);
lockAvailable = true;
allowWrite = false;
assert.deepEqual(post(body), { ok: false });
assert.equal(rows.length, 1);
assert.equal(flushes, 0);
allowWrite = true;
assert.deepEqual(post(body), { ok: true, receiptId, duplicate: false });
assert.equal(flushes, 1);
assert.deepEqual(post(body), { ok: true, receiptId, duplicate: true });
assert.equal(rows.length, 2);
assert.equal(rows[1][rows[0].indexOf("內容")], "測試資料");
console.log("PASS: auth, lock contention, failed write, confirmed receipt, retry deduplication");
