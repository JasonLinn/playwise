"use client";

import { useRef } from "react";
import styles from "./studio.module.css";

const links = [
  ["#portfolio", "精選作品"],
  ["#services", "我們的服務"],
  ["#clients", "合作方式"],
  ["#contact", "聊聊你的想法"],
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
          p↗
        </span>
        <span>
          playwise<small>智遊工作室</small>
        </span>
      </a>
      <nav aria-label="主要導覽" className={styles.nav}>
        {links.map(([href, label], index) => (
          <a
            key={href}
            href={href}
            className={index === 3 ? styles.navContact : undefined}
          >
            {label}
            {index === 0 ? (
              <sup>05</sup>
            ) : index === 3 ? (
              <span aria-hidden="true">↗</span>
            ) : null}
          </a>
        ))}
      </nav>
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
