"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FiCheck, FiChevronLeft, FiInfo } from "react-icons/fi";
import type { Option } from "@/app/lib/line/forms";
import { useLiff } from "../_lib/LiffProvider";

export const brandGradient = "bg-gradient-to-br from-[#1a73e8] via-[#3b8ef0] to-[#14b8a6]";
export const card = "rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-14px_rgba(15,23,42,0.18)]";

export function Page({
  title,
  subtitle,
  back = true,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  children: ReactNode;
}) {
  const { mode, status, error } = useLiff();
  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 pb-[calc(env(safe-area-inset-bottom)+7rem)]">
      <header className={`${brandGradient} px-5 pb-8 pt-5 text-white`}>
        <div className="mb-4 flex items-center justify-between text-sm">
          {back ? (
            <Link href="/liff" className="-ml-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-white/90 hover:bg-white/15">
              <FiChevronLeft aria-hidden="true" />
              選單
            </Link>
          ) : (
            <span className="font-medium tracking-wide text-white/90">智遊工作室 Playwise</span>
          )}
          {mode === "preview" && status === "ready" && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs">預覽模式</span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
        {subtitle && <p className="mt-2 text-[0.95rem] leading-relaxed text-white/90">{subtitle}</p>}
      </header>
      <main className="-mt-4 space-y-4 px-4">
        {status === "loading" && <Skeleton />}
        {status === "error" && <Notice tone="error">{error}</Notice>}
        {status === "ready" && children}
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className={`${card} space-y-3 p-5`} aria-busy="true" aria-label="載入中">
      <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" }) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={`flex gap-2 rounded-xl px-4 py-3 text-sm leading-relaxed ${
        tone === "error" ? "bg-red-50 text-red-700 ring-1 ring-red-100" : "bg-blue-50/70 text-slate-600 ring-1 ring-blue-100"
      }`}
    >
      <FiInfo className="mt-0.5 flex-none" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className={`${card} p-5`}>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Choices({
  label,
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  optional = false,
}: {
  label: string;
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3;
  optional?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (v: string) => {
    if (multiple) onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
    else onChange(selected[0] === v && optional ? "" : v);
  };
  const cols = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">
        {label}
        {multiple && <span className="ml-1 font-normal text-slate-400">（可複選）</span>}
        {optional && <span className="ml-1 font-normal text-slate-400">（選填）</span>}
      </legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => toggle(o.value)}
              className={`relative min-h-[3rem] rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.98] ${
                on
                  ? "bg-blue-50 text-[#1a73e8] ring-2 ring-[#1a73e8]"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              <span className="block pr-5 text-[0.95rem] font-medium leading-snug">{o.label}</span>
              {o.hint && <span className={`mt-0.5 block text-xs ${on ? "text-[#1a73e8]/80" : "text-slate-400"}`}>{o.hint}</span>}
              {on && <FiCheck className="absolute right-2.5 top-3 h-4 w-4" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-base text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  optional,
  type = "text",
  multiline,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: boolean;
  type?: string;
  multiline?: boolean;
  inputMode?: "text" | "tel" | "url" | "email";
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">（選填）</span>}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${inputClass} resize-none leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">{children}</div>
    </div>
  );
}

export const btnPrimary =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a73e8] px-5 py-3.5 text-base font-bold text-white shadow-[0_6px_16px_-6px_rgba(26,115,232,0.6)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3.5 text-base font-medium text-slate-700 transition-all active:scale-[0.98]";
export const btnLine =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#06c755] px-5 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98]";

export function Steps({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className={`${card} px-5 py-4`}>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-900">{labels[current]}</span>
        <span className="text-slate-400">
          {current + 1} / {total}
        </span>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= current ? "bg-[#1a73e8]" : "bg-slate-200"}`} />
        ))}
      </div>
    </div>
  );
}

export function Summary({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-slate-100 rounded-xl bg-slate-50 px-4 ring-1 ring-slate-100">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-3 py-2.5 text-sm">
          <dt className="w-20 flex-none text-slate-500">{k}</dt>
          <dd className="flex-1 whitespace-pre-wrap break-words text-slate-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Success({
  title,
  message,
  rows,
  preview,
  sentToChat,
  onAgain,
}: {
  title: string;
  message: string;
  rows: [string, string][];
  preview?: boolean;
  sentToChat?: boolean;
  onAgain?: () => void;
}) {
  const { close, env } = useLiff();
  return (
    <>
      <section className={`${card} p-6 text-center`}>
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/60">
          <FiCheck className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 leading-relaxed text-slate-600">{message}</p>
        {sentToChat && <p className="mt-2 text-sm text-slate-500">摘要已傳到聊天室，之後的聯絡都會在那裡進行。</p>}
      </section>
      {preview && <Notice>這是預覽模式，資料沒有真的送出。在 LINE 裡開啟才會通知工作室。</Notice>}
      <section className={`${card} p-5`}>
        <h3 className="mb-3 text-sm font-medium text-slate-500">你填寫的內容</h3>
        <Summary rows={rows} />
      </section>
      <BottomBar>
        {onAgain && (
          <button type="button" onClick={onAgain} className={btnGhost}>
            再填一份
          </button>
        )}
        <button type="button" onClick={close} className={btnLine}>
          {env?.inClient ? "回到聊天室" : "回到選單"}
        </button>
      </BottomBar>
    </>
  );
}

/** 把表單草稿暫存在這台裝置，避免不小心關掉 LIFF 視窗就要重填。 */
export function useDraft<T extends object>(key: string, initial: T) {
  const storageKey = `playwise-liff:${key}`;
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setValue((v) => ({ ...v, ...JSON.parse(raw) }));
    } catch {
      /* 無法使用 localStorage 時照常運作 */
    }
    setLoaded(true);
  }, [storageKey]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [loaded, storageKey, value]);
  const clear = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setValue(initial);
  };
  return [value, setValue, clear, loaded] as const;
}
