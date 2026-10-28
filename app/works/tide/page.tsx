import type { Metadata } from 'next';
import localFont from 'next/font/local';
// 首屏字型獨立預載，讓 CSS 保持輕量。由 scripts/subset-case-fonts.mjs 產生。
import '../_fonts/tide-fonts.css';
import TideSite from './TideSite';

// 內文用的中文子集（整頁用到的字），由 scripts/subset-case-fonts.mjs 產生。
// 頁面 load 之後才會被 CSS 引用（見 TideSite 的 data-fonts），不會拖慢首屏。
const zhSerif = localFont({
    src: [
        { path: '../_fonts/tide-serif-300.woff2', weight: '300' },
        { path: '../_fonts/tide-serif-500.woff2', weight: '500' },
    ],
    variable: '--font-zh-serif',
    display: 'swap',
    preload: false,
    adjustFontFallback: false,
});

export const metadata: Metadata = {
    title: '潮間 Between Tides｜台東都蘭海邊民宿 — 智遊工作室作品',
    description: '以台東都蘭海岸為靈感的虛構民宿官網設計。潮位示意、日出日落估算、一日行程與訂房詢問預覽；不提供實際訂房。',
    openGraph: {
        title: '潮間 Between Tides｜民宿官網概念設計',
        description: '以都蘭海岸為靈感的虛構民宿提案。潮位互動與住宿詢問預覽，不提供實際訂房。',
        images: ['https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
};

export default function TidePage() {
    return (
        <div className={zhSerif.variable}>
            <link rel="preload" href="/fonts/showcases/tide-title-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/tide-title-400-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/tide-hero-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/tide-hero-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <TideSite />
        </div>
    );
}
