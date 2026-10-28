'use client';

import styles from './mobile-explore.module.css';

export default function MobileExplore({ links, tone = 'light' }: {
  links: { href: string; label: string }[];
  tone?: 'light' | 'dark';
}) {
  return (
    <details className={styles.menu} data-tone={tone} onKeyDown={(event) => {
      if (event.key === 'Escape') {
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary')?.focus();
      }
    }}>
      <summary>探索<span aria-hidden="true">＋</span></summary>
      <div className={styles.panel}>
        <p>房型、住宿資訊與交通</p>
        {links.map((link, i) => (
          <a key={link.href} href={link.href} onClick={(event) => {
            event.currentTarget.closest('details')?.removeAttribute('open');
          }}>
            <span aria-hidden="true">0{i + 1}</span>{link.label}<span aria-hidden="true">↗</span>
          </a>
        ))}
        <a href="/#portfolio" className={styles.back}>回到智遊作品集 <span aria-hidden="true">↗</span></a>
      </div>
    </details>
  );
}
