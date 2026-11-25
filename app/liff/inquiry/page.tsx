"use client";

import { useEffect, useState } from "react";
import {
  BUDGETS,
  BUSINESS_TYPES,
  CONTACT_METHODS,
  NEEDS,
  TIMELINES,
  sanitizePayload,
  summarize,
  type InquiryData,
} from "@/app/lib/line/forms";
import { useLiff } from "../_lib/LiffProvider";
import { BottomBar, Choices, Field, Notice, Page, Section, Steps, Success, Summary, btnGhost, btnPrimary, useDraft } from "../_components/ui";

const EMPTY: InquiryData = {
  businessType: "",
  brandName: "",
  needs: [],
  description: "",
  budget: "",
  timeline: "",
  contactMethod: "line",
  contactName: "",
  phone: "",
};

const STEP_LABELS = ["你在經營什麼？", "想做哪些事？", "預算與時程", "怎麼聯絡你？"];

const PLACEHOLDERS: Record<string, string> = {
  bnb: "例如：客人常在 LINE 問房況和交通，想要有訂房入口和自動回覆…",
  shop: "例如：想讓客人在 LINE 上預約或點餐，也想做集點卡…",
  freelance: "例如：報價、收訂金、提醒客戶都靠手動，很花時間…",
  association: "例如：會員報名活動要一個個對，想用 LINE 報名和通知…",
};

export default function InquiryPage() {
  const { profile, submit } = useLiff();
  const [form, setForm, clearDraft, loaded] = useDraft<InquiryData>("inquiry", EMPTY);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { preview?: boolean; sentToChat?: boolean; rows: [string, string][] }>(null);

  const set = <K extends keyof InquiryData>(key: K, value: InquiryData[K]) => setForm((f) => ({ ...f, [key]: value }));

  // 從 Flex 訊息的「諮詢這項服務」進來時，預先勾選該項目；用 LINE 名稱預填稱呼
  useEffect(() => {
    if (!loaded) return;
    const need = new URLSearchParams(window.location.search).get("need");
    setForm((f) => ({
      ...f,
      needs: need && NEEDS.some((n) => n.value === need) && !f.needs.includes(need) ? [...f.needs, need] : f.needs,
      contactName: f.contactName || (profile?.displayName && profile.displayName !== "預覽訪客" ? profile.displayName : ""),
    }));
  }, [loaded, profile, setForm]);

  const canNext = [Boolean(form.businessType), form.needs.length > 0, true, Boolean(form.contactName.trim())][step];

  const next = async () => {
    setError("");
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const parsed = sanitizePayload({ type: "inquiry", data: form });
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
      <Page title="需求諮詢" subtitle="謝謝你花時間告訴我們。">
        <Success
          title="已收到你的需求"
          message="我們會先看過你的狀況，通常一個工作天內回覆適合的做法與下一步。"
          rows={done.rows}
          preview={done.preview}
          sentToChat={done.sentToChat}
          onAgain={() => {
            setDone(null);
            setStep(0);
          }}
        />
      </Page>
    );
  }

  const preview = sanitizePayload({ type: "inquiry", data: form });

  return (
    <Page title="需求諮詢" subtitle="不用寫得很完整，我們會陪你一起釐清。草稿會自動保存在這支手機。">
      <Steps current={step} total={4} labels={STEP_LABELS} />

      {step === 0 && (
        <Section title="你在經營什麼？" hint="讓我們知道你的客人是誰。">
          <Choices label="經營類型" options={BUSINESS_TYPES} value={form.businessType} onChange={(v) => set("businessType", v as string)} />
          <Field label="品牌或店名" optional value={form.brandName} onChange={(v) => set("brandName", v)} placeholder="例如：衿日林民宿" />
        </Section>
      )}

      {step === 1 && (
        <Section title="想做哪些事？" hint="不確定也沒關係，選「還不確定」我們一起想。">
          <Choices label="想做的事" options={NEEDS} value={form.needs} onChange={(v) => set("needs", v as string[])} multiple />
          <Field
            label="目前的狀況或最想改善的事"
            optional
            multiline
            value={form.description}
            onChange={(v) => set("description", v)}
            placeholder={PLACEHOLDERS[form.businessType] ?? "例如：每天花很多時間回覆一樣的問題…"}
          />
        </Section>
      )}

      {step === 2 && (
        <Section title="預算與時程" hint="幫助我們建議合適的做法，都可以先不選。">
          <Choices label="預算範圍" options={BUDGETS} value={form.budget} onChange={(v) => set("budget", v as string)} optional />
          <Choices label="希望完成時間" options={TIMELINES} value={form.timeline} onChange={(v) => set("timeline", v as string)} optional />
        </Section>
      )}

      {step === 3 && (
        <>
          <Section title="怎麼聯絡你？">
            <Choices label="偏好的聯絡方式" options={CONTACT_METHODS} value={form.contactMethod} onChange={(v) => set("contactMethod", v as string)} />
            <Field label="怎麼稱呼你" value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="例如：林小姐" autoComplete="name" />
            <Field
              label="電話"
              optional
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="想用電話聯絡時再填"
            />
          </Section>
          {preview.ok && (
            <Section title="送出前確認">
              <Summary rows={summarize(preview.payload)} />
            </Section>
          )}
        </>
      )}

      {error && <Notice tone="error">{error}</Notice>}

      <BottomBar>
        {step > 0 && (
          <button type="button" className={btnGhost} onClick={() => setStep(step - 1)} disabled={sending}>
            上一步
          </button>
        )}
        <button type="button" className={btnPrimary} onClick={next} disabled={!canNext || sending}>
          {sending ? "送出中…" : step < 3 ? "下一步" : "送出需求"}
        </button>
      </BottomBar>
    </Page>
  );
}
