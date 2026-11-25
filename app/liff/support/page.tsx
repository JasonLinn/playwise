"use client";

import { useEffect, useState } from "react";
import { STUDIO } from "@/app/lib/line/content";
import { SUPPORT_KINDS, SUPPORT_PROJECTS, URGENCY, sanitizePayload, summarize, type SupportData } from "@/app/lib/line/forms";
import { useLiff } from "../_lib/LiffProvider";
import { BottomBar, Choices, Field, Notice, Page, Section, Success, btnPrimary, useDraft } from "../_components/ui";

const EMPTY: SupportData = { project: "", projectOther: "", kind: "", urgency: "normal", description: "", pageUrl: "", contactName: "" };

export default function SupportPage() {
  const { profile, submit } = useLiff();
  const [form, setForm, clearDraft, loaded] = useDraft<SupportData>("support", EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { preview?: boolean; sentToChat?: boolean; rows: [string, string][] }>(null);
  const set = <K extends keyof SupportData>(key: K, value: SupportData[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!loaded) return;
    setForm((f) => ({
      ...f,
      contactName: f.contactName || (profile?.displayName && profile.displayName !== "預覽訪客" ? profile.displayName : ""),
    }));
  }, [loaded, profile, setForm]);

  const send = async () => {
    setError("");
    const parsed = sanitizePayload({ type: "support", data: form });
    if (!parsed.ok) return setError(parsed.error);
    setSending(true);
    const result = await submit(parsed.payload);
    setSending(false);
    if (!result.ok) return setError(result.error);
    setDone({ preview: result.preview, sentToChat: result.sentToChat, rows: summarize(parsed.payload) });
    clearDraft();
    window.scrollTo({ top: 0 });
  };

  if (done) {
    return (
      <Page title="維護回報">
        <Success
          title="已收到你的回報"
          message="我們會依急迫度安排處理，有進度會在聊天室告訴你。有截圖的話，直接傳到聊天室就可以。"
          rows={done.rows}
          preview={done.preview}
          sentToChat={done.sentToChat}
          onAgain={() => setDone(null)}
        />
      </Page>
    );
  }

  const ready = form.project && form.kind && form.description.trim().length >= 4;

  return (
    <Page title="維護回報" subtitle="已合作的客戶專用。要改內容、功能怪怪的、想加新功能，都從這裡告訴我們。">
      <Section title="是哪個專案？">
        <Choices label="專案" options={SUPPORT_PROJECTS} value={form.project} onChange={(v) => set("project", v as string)} />
        {form.project === "other" && (
          <Field label="專案名稱" value={form.projectOther} onChange={(v) => set("projectOther", v)} placeholder="例如：○○民宿官網" />
        )}
      </Section>

      <Section title="發生什麼事？">
        <Choices label="類型" options={SUPPORT_KINDS} value={form.kind} onChange={(v) => set("kind", v as string)} />
        <Choices label="急迫度" options={URGENCY} value={form.urgency} onChange={(v) => set("urgency", v as string)} columns={3} />
        <Field
          label="狀況說明"
          multiline
          value={form.description}
          onChange={(v) => set("description", v)}
          placeholder="例如：首頁的優惠價格要改成 3,200；手機版按訂房按鈕沒有反應…"
        />
        <Field label="相關網址" optional type="url" inputMode="url" value={form.pageUrl} onChange={(v) => set("pageUrl", v)} placeholder="https://" />
        <Field label="聯絡人" optional value={form.contactName} onChange={(v) => set("contactName", v)} autoComplete="name" />
      </Section>

      {form.urgency === "urgent" && (
        <Notice>
          緊急狀況送出後，也可以直接撥打{" "}
          <a href={STUDIO.tel} className="font-medium text-[#1a73e8] underline">
            {STUDIO.phone}
          </a>
          ，我們會優先處理。
        </Notice>
      )}
      <Notice>截圖或影片在送出後直接傳到聊天室就可以，我們會一起看。</Notice>
      {error && <Notice tone="error">{error}</Notice>}

      <BottomBar>
        <button type="button" className={btnPrimary} onClick={send} disabled={!ready || sending}>
          {sending ? "送出中…" : "送出回報"}
        </button>
      </BottomBar>
    </Page>
  );
}
