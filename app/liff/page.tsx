"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiGlobe,
  FiGrid,
  FiMapPin,
  FiPhone,
  FiSmartphone,
  FiTool,
} from "react-icons/fi";
import { SITE_URL, STUDIO } from "@/app/lib/line/content";
import { useLiff } from "./_lib/LiffProvider";
import { Page, brandGradient, card } from "./_components/ui";

const tiles: { href: string; icon: IconType; title: string; sub: string; tone: string }[] = [
  { href: "/liff/services", icon: FiGrid, title: "服務項目", sub: "網站・LINE・自動化", tone: "bg-blue-50 text-[#1a73e8]" },
  { href: "/liff/cases", icon: FiBriefcase, title: "作品案例", sub: "已上線的真實作品", tone: "bg-teal-50 text-teal-600" },
  { href: "/liff/booking", icon: FiCalendar, title: "預約諮詢", sub: "約 30 分鐘聊聊", tone: "bg-indigo-50 text-indigo-600" },
  { href: "/liff/demo", icon: FiSmartphone, title: "體驗 LIFF", sub: "看看 LINE 能做什麼", tone: "bg-emerald-50 text-emerald-600" },
];

export default function LiffHome() {
  const { profile, openUrl } = useLiff();
  return (
    <Page title={profile ? `嗨，${profile.displayName}` : "嗨，歡迎你"} subtitle="想做網站、LINE 服務或自動化流程？從這裡開始。" back={false}>
      <Link href="/liff/inquiry" className={`${brandGradient} relative block overflow-hidden rounded-2xl p-6 text-white shadow-[0_18px_40px_-20px_rgba(26,115,232,0.8)]`}>
        <span className="mb-3 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">免費・約 3 分鐘</span>
        <h2 className="text-2xl font-bold">需求諮詢</h2>
        <p className="mt-1.5 max-w-[16rem] text-white/90">說說你的店和想改善的事，我們回覆適合的做法與下一步。</p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 font-bold text-[#1a73e8]">
          開始填寫
          <FiArrowRight aria-hidden="true" />
        </span>
        <span className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-4 top-6 h-16 w-16 rounded-full bg-white/10" aria-hidden="true" />
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ href, icon: Icon, title, sub, tone }) => (
          <Link key={href} href={href} className={`${card} p-4 transition-transform active:scale-[0.98]`}>
            <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="block font-bold text-slate-900">{title}</span>
            <span className="block text-sm text-slate-500">{sub}</span>
          </Link>
        ))}
      </div>

      <Link href="/liff/support" className={`${card} flex items-center gap-4 p-4`}>
        <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <FiTool className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-slate-900">已合作客戶・維護回報</span>
          <span className="block text-sm text-slate-500">網站要改內容、功能怪怪的，從這裡告訴我們</span>
        </span>
        <FiArrowRight className="text-slate-400" aria-hidden="true" />
      </Link>

      <section className={`${card} divide-y divide-slate-100`}>
        <a href={STUDIO.tel} className="flex items-center gap-3 px-5 py-4 text-slate-700">
          <FiPhone className="text-[#1a73e8]" aria-hidden="true" />
          <span className="flex-1">{STUDIO.phone}</span>
          <span className="text-sm text-slate-400">撥打</span>
        </a>
        <button type="button" onClick={() => openUrl(STUDIO.mapUrl)} className="flex w-full items-center gap-3 px-5 py-4 text-left text-slate-700">
          <FiMapPin className="text-[#1a73e8]" aria-hidden="true" />
          <span className="flex-1">{STUDIO.address}</span>
          <span className="text-sm text-slate-400">地圖</span>
        </button>
        <button type="button" onClick={() => openUrl(SITE_URL)} className="flex w-full items-center gap-3 px-5 py-4 text-left text-slate-700">
          <FiGlobe className="text-[#1a73e8]" aria-hidden="true" />
          <span className="flex-1">官方網站</span>
          <span className="text-sm text-slate-400">開啟</span>
        </button>
      </section>
      <p className="pb-2 text-center text-xs text-slate-400">回覆時間：{STUDIO.hours}</p>
    </Page>
  );
}
