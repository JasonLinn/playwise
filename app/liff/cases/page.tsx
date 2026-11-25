"use client";

import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { CASES, SITE_URL } from "@/app/lib/line/content";
import { useLiff } from "../_lib/LiffProvider";
import { BottomBar, Page, btnPrimary, card } from "../_components/ui";

const DEMOS = [
  ["洗衣廠 LINE 訂單原型", "在 LINE 裡選品項、取送時間，送出前核對金額。", "/works/laundry"],
  ["潮間 Between Tides", "海邊民宿官網示範，潮汐互動與房費試算。", "/works/tide"],
  ["霧裡山房 Mist House", "茶園民宿官網示範，節氣選擇與泡茶計時。", "/works/mist"],
];

export default function CasesPage() {
  const { openUrl } = useLiff();
  return (
    <Page title="作品案例" subtitle="替真實客戶做好、已經上線的網站與 LINE 服務。">
      {CASES.map((c) => (
        <article key={c.url} className={`${card} overflow-hidden`}>
          <button type="button" onClick={() => openUrl(c.url)} className="block w-full text-left">
            {/* 作品截圖：LIFF 頁面不經過 next/image，避免在 LINE 內建瀏覽器多一次轉址 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt={`${c.name} 畫面`} className="aspect-[3/2] w-full bg-slate-100 object-cover object-top" loading="lazy" />
            <div className="p-5">
              <span className="text-xs font-bold text-[#1a73e8]">{c.type}</span>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{c.name}</h2>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">{c.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {c.did.map((d) => (
                  <li key={d} className="rounded-md bg-slate-50 px-2 py-0.5 text-sm text-slate-600 ring-1 ring-slate-200/70">
                    {d}
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1a73e8]">
                {c.url.replace(/^https?:\/\//, "")}
                <FiExternalLink aria-hidden="true" />
              </span>
            </div>
          </button>
        </article>
      ))}

      <section className={`${card} p-5`}>
        <h2 className="text-lg font-bold text-slate-900">可以試玩的示範</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {DEMOS.map(([title, text, href]) => (
            <li key={href}>
              <button type="button" onClick={() => openUrl(`${SITE_URL}${href}`)} className="w-full py-3 text-left">
                <span className="block font-medium text-slate-900">{title}</span>
                <span className="block text-sm text-slate-500">{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <BottomBar>
        <Link href="/liff/inquiry" className={btnPrimary}>
          我也想做一個
        </Link>
      </BottomBar>
    </Page>
  );
}
