"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiCamera, FiMapPin, FiMessageSquare, FiSend, FiShare2, FiUser, FiX } from "react-icons/fi";
import { SITE_URL, STUDIO } from "@/app/lib/line/content";
import { useLiff } from "../_lib/LiffProvider";
import { BottomBar, Notice, Page, btnPrimary, card } from "../_components/ui";

const CONTEXT_LABEL: Record<string, string> = {
  utou: "和官方帳號的一對一聊天室",
  group: "群組",
  room: "多人聊天室",
  external: "一般瀏覽器",
  none: "LINE 內（非聊天室）",
  square_chat: "社群",
};

const USE_CASES = ["線上預約", "點餐／訂單", "會員卡・集點", "領優惠券", "活動報名", "GPS 集章", "問卷回饋", "推薦好友"];

function Demo({
  icon: Icon,
  title,
  usedFor,
  action,
  onRun,
  result,
  disabled,
}: {
  icon: IconType;
  title: string;
  usedFor: string;
  action: string;
  onRun: () => void;
  result?: ReactNode;
  disabled?: string;
}) {
  return (
    <article className={`${card} p-5`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">適合：{usedFor}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRun}
        disabled={Boolean(disabled)}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-bold text-white transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-500"
      >
        {disabled || action}
      </button>
      {result && <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-100">{result}</div>}
    </article>
  );
}

export default function DemoPage() {
  const { liff, mode, profile, env, close } = useLiff();
  const [results, setResults] = useState<Record<string, ReactNode>>({});
  const show = (key: string, node: ReactNode) => setResults((r) => ({ ...r, [key]: node }));
  const preview = mode === "preview";
  const inChat = env?.inClient && env.contextType === "utou";
  const available = (api: "shareTargetPicker" | "scanCodeV2") => preview || Boolean(liff?.isApiAvailable(api));

  const sendMessage = async () => {
    if (preview || !liff) return show("send", "（預覽）在 LINE 裡，這裡會以你的名義傳一則訊息到聊天室。");
    try {
      await liff.sendMessages([{ type: "text", text: "我剛剛在體驗 LIFF：這則訊息是從 LIFF 頁面傳出來的 👋" }]);
      show("send", "已傳到聊天室！關掉這頁就看得到。預約完成、訂單成立時，就能這樣自動留下紀錄。");
    } catch {
      show("send", "要從官方帳號的聊天室打開這個頁面，才能傳訊息喔。");
    }
  };

  const share = async () => {
    if (preview || !liff) return show("share", "（預覽）在 LINE 裡，這裡會跳出好友清單，把工作室名片分享出去。");
    try {
      const res = await liff.shareTargetPicker([
        {
          type: "flex",
          altText: `推薦你 ${STUDIO.name}：網站、LINE 服務與自動化`,
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                { type: "text", text: `${STUDIO.name} ${STUDIO.nameEn}`, weight: "bold", size: "lg", color: "#0f172a" },
                { type: "text", text: "幫民宿、小店與在地團隊做網站、LINE 服務與自動化流程。", size: "sm", color: "#64748b", wrap: true },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                { type: "button", style: "primary", color: "#06c755", action: { type: "uri", label: "加入 LINE 好友", uri: STUDIO.lineAddUrl } },
                { type: "button", style: "link", action: { type: "uri", label: "看作品", uri: SITE_URL } },
              ],
            },
          },
        },
      ]);
      show("share", res ? "分享成功，謝謝你的推薦！推薦好友、揪團、轉發優惠券都是這個功能。" : "已取消分享。");
    } catch {
      show("share", "這個環境無法分享，請在 LINE App 裡開啟。");
    }
  };

  const scan = async () => {
    if (preview || !liff) return show("scan", "（預覽）在 LINE 裡，這裡會打開相機掃 QR Code。");
    try {
      const { value } = await liff.scanCodeV2();
      show("scan", value ? <>掃到了：<span className="break-all font-mono">{value}</span></> : "沒有掃到內容。");
    } catch {
      show("scan", "無法開啟掃描（需要相機權限，或 LIFF 尺寸需為 Full）。");
    }
  };

  const locate = () => {
    if (!navigator.geolocation) return show("geo", "這個裝置不支援定位。");
    show("geo", "定位中…");
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        show(
          "geo",
          <>
            已取得位置（誤差約 {Math.round(pos.coords.accuracy)} 公尺）。實際應用時，可以判斷客人是不是到了店門口或景點，再幫他蓋章、發券。
            <span className="mt-1 block text-xs text-slate-400">位置只在你的手機上計算，這個示範不會上傳。</span>
          </>,
        ),
      () => show("geo", "沒有取得定位權限。"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <Page title="體驗 LIFF" subtitle="你現在打開的就是 LIFF：在 LINE 裡執行的網頁小程式。不用下載 App、不用註冊，就知道你是誰。">
      <section className={`${card} p-5`}>
        <div className="flex items-center gap-4">
          {profile?.pictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.pictureUrl} alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-emerald-50" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-4 ring-slate-50">
              <FiUser className="h-7 w-7" aria-hidden="true" />
            </span>
          )}
          <div>
            <p className="text-sm text-slate-500">LINE 已經告訴我們你是</p>
            <p className="text-xl font-bold text-slate-900">{profile?.displayName ?? "（尚未登入）"}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            ["開啟位置", CONTEXT_LABEL[env?.contextType ?? "external"] ?? env?.contextType],
            ["裝置", env?.os === "ios" ? "iPhone / iPad" : env?.os === "android" ? "Android" : "電腦／瀏覽器"],
            ["語言", env?.language],
            ["LINE 版本", env?.lineVersion ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
              <dt className="text-xs text-slate-400">{k}</dt>
              <dd className="font-medium text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          開店最常卡的「客人是誰」，在 LINE 裡一開始就解決了：會員卡、預約紀錄、集點都能直接綁在他的 LINE 上。
        </p>
      </section>

      {preview && <Notice>目前是預覽模式。從官方帳號的圖文選單打開，下面的按鈕才會真的動作。</Notice>}

      <Demo icon={FiSend} title="從頁面傳訊息到聊天室" usedFor="預約完成通知、訂單摘要" action="傳一則訊息" onRun={sendMessage} result={results.send} disabled={!preview && !inChat ? "請從聊天室開啟" : undefined} />
      <Demo icon={FiShare2} title="分享給 LINE 好友" usedFor="推薦好友、揪團、轉發優惠券" action="分享工作室名片" onRun={share} result={results.share} disabled={available("shareTargetPicker") ? undefined : "此環境不支援分享"} />
      <Demo icon={FiCamera} title="掃描 QR Code" usedFor="集點、核銷優惠券、活動報到" action="打開相機掃描" onRun={scan} result={results.scan} disabled={available("scanCodeV2") ? undefined : "此環境不支援掃描"} />
      <Demo icon={FiMapPin} title="取得目前位置" usedFor="GPS 集章、到店打卡（冬山河漫遊護照）" action="試試定位" onRun={locate} result={results.geo} />

      <section className={`${card} p-5`}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <FiMessageSquare className="text-[#1a73e8]" aria-hidden="true" />
          這些可以組成什麼？
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {USE_CASES.map((u) => (
            <li key={u} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-[#1a73e8]">
              {u}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          這個官方帳號的選單、表單、自動回覆，就是我們幫客戶做的同一套東西。想要一個屬於你的嗎？
        </p>
      </section>

      <BottomBar>
        {env?.inClient && (
          <button type="button" onClick={close} className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 text-slate-600" aria-label="關閉視窗">
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <Link href="/liff/inquiry?need=liff" className={btnPrimary}>
          聊聊我的 LIFF 點子
        </Link>
      </BottomBar>
    </Page>
  );
}
