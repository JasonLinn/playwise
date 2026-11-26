"use client";

import { useEffect, useMemo, useState } from "react";
import { MEETING_METHODS, TIME_SLOTS, sanitizePayload, summarize, type BookingData } from "@/app/lib/line/forms";
import { useLiff } from "../_lib/LiffProvider";
import { BottomBar, Choices, Field, Notice, Page, Section, Success, btnPrimary, useDraft } from "../_components/ui";

const EMPTY: BookingData = { date: "", slot: "", method: "call", topic: "", contactName: "", phone: "" };
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 明天起 3 週內的平日。 */
function upcomingWeekdays(): { iso: string; day: string; week: string; month: number }[] {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 1; out.length < 15 && i < 30; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    if (x.getDay() === 0 || x.getDay() === 6) continue;
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    out.push({ iso, day: String(x.getDate()), week: WEEKDAYS[x.getDay()], month: x.getMonth() + 1 });
  }
  return out;
}

export default function BookingPage() {
  const { profile, submit } = useLiff();
  const [form, setForm, clearDraft, loaded] = useDraft<BookingData>("booking", EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { preview?: boolean; rows: [string, string][] }>(null);
  const days = useMemo(upcomingWeekdays, []);
  const set = <K extends keyof BookingData>(key: K, value: BookingData[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!loaded) return;
    setForm((f) => ({
      ...f,
      // 草稿裡的日期過期了就清掉
      date: days.some((d) => d.iso === f.date) ? f.date : "",
      contactName: f.contactName || (profile?.displayName && profile.displayName !== "預覽訪客" ? profile.displayName : ""),
    }));
  }, [loaded, profile, days, setForm]);

  const send = async () => {
    setError("");
    const parsed = sanitizePayload({ type: "booking", data: form });
    if (!parsed.ok) return setError(parsed.error);
    setSending(true);
    const result = await submit(parsed.payload);
    setSending(false);
    if (!result.ok) return setError(result.error);
    setDone({ preview: result.preview, rows: summarize(parsed.payload) });
    if (!result.preview) clearDraft();
    window.scrollTo({ top: 0 });
  };

  if (done) {
    return (
      <Page title="預約諮詢">
        <Success
          title="已送出預約申請"
          message="我們確認時間後會在聊天室回覆你；如果時段不方便，也會提議其他時間。"
          rows={done.rows}
          preview={done.preview}
        />
      </Page>
    );
  }

  const ready = form.date && form.slot && form.method && form.contactName.trim();

  return (
    <Page title="預約諮詢" subtitle="約 30 分鐘，聊聊你的狀況和想法。這是預約申請，我們確認後會回覆你。">
      <Section title="選一天" hint="平日時段；想約週末請在下方備註。">
        <div className="-mx-5 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1" role="radiogroup" aria-label="日期">
          {days.map((d, i) => {
            const on = form.date === d.iso;
            const showMonth = i === 0 || d.day === "1" || days[i - 1].month !== d.month;
            return (
              <button
                key={d.iso}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${d.month}月${d.day}日 星期${d.week}`}
                onClick={() => set("date", d.iso)}
                className={`flex w-16 flex-none snap-start flex-col items-center rounded-xl py-2.5 transition-all ${
                  on ? "bg-[#1a73e8] text-white shadow-md" : "bg-white text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                <span className={`text-[0.7rem] ${on ? "text-white/80" : "text-slate-400"}`}>{showMonth ? `${d.month}月` : " "}</span>
                <span className="text-xl font-bold leading-tight">{d.day}</span>
                <span className={`text-xs ${on ? "text-white/90" : "text-slate-500"}`}>週{d.week}</span>
              </button>
            );
          })}
        </div>
        <Choices label="時段" options={TIME_SLOTS} value={form.slot} onChange={(v) => set("slot", v as string)} />
      </Section>

      <Section title="怎麼聊">
        <Choices label="會議方式" options={MEETING_METHODS} value={form.method} onChange={(v) => set("method", v as string)} columns={1} />
        <Field
          label="想聊什麼"
          optional
          multiline
          value={form.topic}
          onChange={(v) => set("topic", v)}
          placeholder="例如：想改 LINE 圖文選單、評估做線上預約…"
        />
      </Section>

      <Section title="聯絡資料">
        <Field label="怎麼稱呼你" value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="例如：林先生" autoComplete="name" />
        <Field label="電話" optional type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="選電話聯絡時建議填寫" />
      </Section>

      {error && <Notice tone="error">{error}</Notice>}

      <BottomBar>
        <button type="button" className={btnPrimary} onClick={send} disabled={!ready || sending}>
          {sending ? "送出中…" : "送出預約申請"}
        </button>
      </BottomBar>
    </Page>
  );
}
