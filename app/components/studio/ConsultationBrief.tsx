"use client";

import { useRef, useState } from "react";
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
  const field = useRef<HTMLTextAreaElement>(null);

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
      <p role="status" aria-atomic="true">
        {status || "內容只留在此頁，開啟 LINE 不會自動傳送。"}
      </p>
    </div>
  );
}
