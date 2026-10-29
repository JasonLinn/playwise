"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./studio.module.css";

export default function ConsultationBrief({
  initialText,
  id,
}: {
  initialText: string;
  id: string;
}) {
  const [text, setText] = useState(initialText);
  const [status, setStatus] = useState("");
  const [canSave, setCanSave] = useState(true);
  const field = useRef<HTMLTextAreaElement>(null);
  const storageKey = `playwise:consultation:${id}`;

  function saveDraft(next: string) {
    try {
      sessionStorage.setItem(storageKey, next);
      setCanSave(true);
    } catch {
      setCanSave(false);
    }
  }

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) setText(saved);
    } catch {
      setCanSave(false);
    }
    if (id !== "contact-message") return;
    function chooseService(event: Event) {
      const service = (event as CustomEvent<string>).detail;
      if (
        !["品牌網站設計", "工作流程自動化", "LINE 與智慧客服"].includes(service)
      )
        return;
      const current = field.current?.value ?? initialText;
      const next = `想了解：${service}\n${current.replace(/^想了解：[^\n]*\n/, "")}`;
      setText(next);
      setStatus("已帶入服務項目，原本填寫的內容仍保留。");
      try {
        sessionStorage.setItem(storageKey, next);
      } catch {
        setCanSave(false);
      }
    }
    window.addEventListener("playwise:consultation-service", chooseService);
    return () =>
      window.removeEventListener(
        "playwise:consultation-service",
        chooseService,
      );
  }, [id, initialText, storageKey]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("已複製。開啟 LINE 後貼上，確認內容再傳送。");
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus(
        "自動複製未成功，已選取上方內容。請長按文字或使用 Ctrl／⌘ + C 複製，再貼到 LINE。",
      );
    }
  }

  return (
    <div className={styles.composer}>
      <label htmlFor={id}>第一則訊息，可以這樣開始</label>
      <p id={`${id}-help`}>
        填寫你方便分享的資訊；還沒有網站，也可以直接描述問題。
      </p>
      <textarea
        id={id}
        ref={field}
        rows={5}
        value={text}
        aria-describedby={`${id}-help`}
        onChange={(event) => {
          setText(event.target.value);
          saveDraft(event.target.value);
          setStatus("");
        }}
      />
      <div className={styles.composerActions}>
        <button type="button" onClick={copy} disabled={!text.trim()}>
          複製諮詢內容
        </button>
        <a
          href="https://lin.ee/N4ukE55"
          target="_blank"
          rel="noopener noreferrer"
        >
          開啟 LINE 聊聊 <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.draftOptions}>
        <p>
          {canSave
            ? "草稿暫存在此瀏覽器分頁，不會自動傳送。"
            : "此瀏覽器無法暫存草稿，離開前請先複製。"}
        </p>
        <button
          type="button"
          onClick={() => {
            setText(initialText);
            saveDraft(initialText);
            setStatus("已重設為起始範本。");
            field.current?.focus();
          }}
        >
          重設範本
        </button>
      </div>
      <p role="status" aria-atomic="true">
        {status || "複製後開啟 LINE，貼上並確認內容再傳送。"}
      </p>
    </div>
  );
}
