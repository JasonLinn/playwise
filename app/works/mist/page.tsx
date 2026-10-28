import type { Metadata } from 'next';
import localFont from 'next/font/local';
// 首屏字型獨立預載，讓 CSS 保持輕量。由 scripts/subset-case-fonts.mjs 產生。
import '../_fonts/mist-fonts.css';
import MistSite from './MistSite';

// 內文用的中文子集（整頁用到的字），由 scripts/subset-case-fonts.mjs 產生。
// 頁面 load 之後才會被 CSS 引用（見 MistSite 的 data-fonts），不會拖慢首屏。
const zhSerif = localFont({
    src: [
        { path: '../_fonts/mist-serif-300.woff2', weight: '300' },
        { path: '../_fonts/mist-serif-500.woff2', weight: '500' },
    ],
    variable: '--font-zh-serif',
    display: 'swap',
    preload: false,
    adjustFontFallback: false,
});

export const metadata: Metadata = {
    title: '霧裡山房 Mist House｜坪林茶園民宿 — 智遊工作室作品',
    description: '以坪林茶山為靈感的虛構民宿官網設計。霧氣互動、節氣環、泡茶計時器與可複製的預約訊息；不提供實際訂房。',
    openGraph: {
        title: '霧裡山房 Mist House｜民宿官網概念設計',
        description: '以坪林茶山為靈感的虛構民宿提案。節氣、泡茶與詢問訊息互動，不提供實際訂房。',
        images: ['https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
};

export default function MistPage() {
    return (
        <div className={zhSerif.variable}>
            <link rel="preload" href="/fonts/showcases/mist-title-300-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/mist-title-400-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/mist-hero-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/mist-hero-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="/fonts/showcases/mist-mono-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <MistSite />
        </div>
    );
}
