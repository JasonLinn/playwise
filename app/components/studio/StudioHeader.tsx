"use client";

import { useRef } from "react";
import styles from "./studio.module.css";

const LINE_URL = "https://lin.ee/N4ukE55";

const links = [
  ["#portfolio", "作品案例"],
  ["#services", "服務項目"],
  ["#who", "適合對象"],
  ["#clients", "合作方式"],
  ["#contact", "聯絡我們"],
];

export default function StudioHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }
  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="playwise 智遊工作室首頁">
        <span className={styles.brandMark} aria-hidden="true">
          <svg viewBox="0 0 64 64" width="40" height="40" fill="none">
            <path
              d="M18 47V24h8a9 9 0 0 1 0 18h-8m17-24h13v13m-1-12L31 35"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="square"
            />
          </svg>
        </span>
        <span>
          playwise<small>智遊工作室</small>
        </span>
      </a>
      <nav aria-label="主要導覽" className={styles.nav}>
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.lineButton}
        >
          LINE 諮詢
          <span className={styles.srOnly}>（另開新視窗）</span>
        </a>
      </nav>
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.lineButton} ${styles.lineButtonMobile}`}
      >
        LINE 諮詢
        <span className={styles.srOnly}>（另開新視窗）</span>
      </a>
      <details
        className={styles.mobileMenu}
        ref={menu}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) {
            closeMenu();
            trigger.current?.focus();
          }
        }}
      >
        <summary ref={trigger} aria-controls="mobile-navigation">
          選單 <span aria-hidden="true">＋</span>
        </summary>
        <nav id="mobile-navigation" aria-label="手機導覽">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
