"use client";

// LIFF 初始化與共用操作。沒有設定 NEXT_PUBLIC_LIFF_ID（或網址加 ?preview=1）時進入「預覽模式」，
// 用假資料讓一般瀏覽器也能看畫面與走完流程，不會真的送出。
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Liff } from "@line/liff";
import { LIFF_ID } from "@/app/lib/line/content";
import type { FormPayload } from "@/app/lib/line/forms";

type Profile = { userId?: string; displayName: string; pictureUrl?: string };

export type LiffEnv = {
  inClient: boolean;
  os: string;
  language: string;
  lineVersion: string | null;
  contextType: string;
};

type State = {
  status: "loading" | "ready" | "error";
  mode: "liff" | "preview";
  liff: Liff | null;
  profile: Profile | null;
  env: LiffEnv | null;
  error: string | null;
};

export type SubmitResult = { ok: true; preview?: boolean } | { ok: false; error: string };

type Ctx = State & {
  submit: (payload: FormPayload) => Promise<SubmitResult>;
  openUrl: (url: string) => void;
  close: () => void;
};

const LiffContext = createContext<Ctx | null>(null);

const PREVIEW_PROFILE: Profile = { displayName: "預覽訪客" };

function previewEnv(): LiffEnv {
  return {
    inClient: false,
    os: typeof navigator !== "undefined" && /iphone|ipad/i.test(navigator.userAgent) ? "ios" : /android/i.test(navigator.userAgent) ? "android" : "web",
    language: typeof navigator !== "undefined" ? navigator.language : "zh-TW",
    lineVersion: null,
    contextType: "external",
  };
}

export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: "loading", mode: "liff", liff: null, profile: null, env: null, error: null });

  const requestIds = useRef<Partial<Record<FormPayload["type"], string>>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!LIFF_ID || params.get("preview") === "1") {
      setState({ status: "ready", mode: "preview", liff: null, profile: PREVIEW_PROFILE, env: previewEnv(), error: null });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId: LIFF_ID });
        // liff.line.me/{id}/inquiry 會先開到 Endpoint 並帶 liff.state，init 會自動轉址，這段期間維持 loading
        if (new URLSearchParams(window.location.search).has("liff.state")) return;
        let profile: Profile | null = null;
        if (liff.isLoggedIn()) {
          profile = await liff.getProfile().catch(() => null);
        }
        const ctx = liff.getContext();
        if (cancelled) return;
        setState({
          status: "ready",
          mode: "liff",
          liff,
          profile,
          env: {
            inClient: liff.isInClient(),
            os: liff.getOS() ?? "web",
            language: liff.getAppLanguage?.() ?? liff.getLanguage(),
            lineVersion: liff.getLineVersion(),
            contextType: ctx?.type ?? "external",
          },
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setState((s) => ({ ...s, status: "error", error: "LINE 功能載入失敗，請關閉後重新開啟。" }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(
    async (payload: FormPayload): Promise<SubmitResult> => {
      if (state.mode === "preview") {
        await new Promise((r) => setTimeout(r, 700));
        return { ok: true, preview: true };
      }
      const liff = state.liff;
      if (!liff) return { ok: false, error: "LINE 尚未準備好，請稍候再試" };
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return { ok: false, error: "請先登入 LINE" };
      }

      // 表單送進工作室收件表，不把可能含個資的摘要送到目前的聊天室。
      const storageKey = `playwise-liff:request:${payload.type}`;
      try {
        let saved: string | null = null;
        try { saved = localStorage.getItem(storageKey); } catch { /* 仍可在這個頁面重試 */ }
        const requestId = requestIds.current[payload.type] ??
          (saved && /^[0-9a-f-]{36}$/i.test(saved) ? saved : crypto.randomUUID());
        requestIds.current[payload.type] = requestId;
        try { localStorage.setItem(storageKey, requestId); } catch { /* 保留記憶體中的單號 */ }

        const res = await fetch("/api/liff/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload, idToken: liff.getIDToken(), requestId }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.ok === true && /^[0-9a-f]{64}$/.test(data.receiptId ?? "")) {
          delete requestIds.current[payload.type];
          try {
            if (localStorage.getItem(storageKey) === requestId) localStorage.removeItem(storageKey);
          } catch { /* 收件已完成 */ }
          return { ok: true };
        }
        return { ok: false, error: typeof data?.error === "string" ? data.error : "無法確認收件，請稍後再試" };
      } catch {
        return { ok: false, error: "無法確認收件，請稍後再試" };
      }
    },
    [state.mode, state.liff],
  );

  const openUrl = useCallback(
    (url: string) => {
      if (state.liff && state.env?.inClient) state.liff.openWindow({ url, external: false });
      else window.open(url, "_blank", "noopener,noreferrer");
    },
    [state.liff, state.env],
  );

  const close = useCallback(() => {
    if (state.liff && state.env?.inClient) state.liff.closeWindow();
    else window.location.href = "/liff";
  }, [state.liff, state.env]);

  const value = useMemo(() => ({ ...state, submit, openUrl, close }), [state, submit, openUrl, close]);
  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}

export function useLiff() {
  const ctx = useContext(LiffContext);
  if (!ctx) throw new Error("useLiff must be used inside <LiffProvider>");
  return ctx;
}
