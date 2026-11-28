"use client";

import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { FAQS, SERVICES } from "@/app/lib/line/content";
import { BottomBar, Page, Section, btnPrimary, card } from "../_components/ui";

const NEED_FOR: Record<string, string> = { web: "website", line: "liff", automation: "automation" };

const STEPS = [
  ["聊聊現在", "了解你的客人、工作方式，和最想改善的問題。沒有規格書也可以開始。"],
  ["一起釐清", "確認範圍、素材、費用與時程，先把期待說清楚再動工。"],
  ["做出來，試著用", "透過預覽與實際操作調整細節，確認手機上也順手。"],
  ["上線，也交接", "上線後說明日常操作，後續維護依約定範圍進行。"],
];

export default function ServicesPage() {
  return (
    <Page title="服務項目" subtitle="網站、LINE 與自動化，可以單做一項，也可以一起規劃。">
      {SERVICES.map((s) => (
        <article key={s.id} className={`${card} overflow-hidden`}>
          <div className="h-1.5" style={{ background: s.hue }} aria-hidden="true" />
          <div className="p-5">
            <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
            <p className="mt-1.5 leading-relaxed text-slate-600">{s.description}</p>
            <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {s.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <FiCheck className="mt-1 flex-none text-teal-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-500">案例：{s.examples.join("、")}</p>
            <Link href={`/liff/inquiry?need=${NEED_FOR[s.id]}`} className="mt-4 inline-flex items-center gap-1 font-medium text-[#1a73e8]">
              諮詢這項服務
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}

      <Section title="合作流程">
        <ol className="space-y-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#1a73e8]">{i + 1}</span>
              <span>
                <span className="block font-bold text-slate-900">{title}</span>
                <span className="block text-sm leading-relaxed text-slate-600">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <section id="faq" className={`${card} scroll-mt-4 p-5`}>
        <h2 className="mb-2 text-lg font-bold text-slate-900">常見問題</h2>
        <div className="divide-y divide-slate-100">
          {FAQS.map((f) => (
            <details key={f.id} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-lg text-[#1a73e8] transition-transform group-open:rotate-45" aria-hidden="true">
                  ＋
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <BottomBar>
        <Link href="/liff/inquiry" className={btnPrimary}>
          免費需求諮詢
        </Link>
      </BottomBar>
    </Page>
  );
}
