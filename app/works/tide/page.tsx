import type { Metadata } from 'next';
import localFont from 'next/font/local';
// 首屏字型（首屏中文＋英文展示字型）以 base64 內嵌，不產生額外請求。由 scripts/subset-case-fonts.mjs 產生
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
    description: '四間面向太平洋的房，跟著潮汐生活。台東都蘭海邊民宿官網設計示範：即時潮汐鐘、日出時間、一日行程與線上訂房詢問。',
    openGraph: {
        title: '潮間 Between Tides｜台東都蘭海邊民宿',
        description: '四間面向太平洋的房，跟著潮汐生活。',
        images: ['https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
};

export default function TidePage() {
    return (
        <div className={zhSerif.variable}>
            <TideSite />
        </div>
    );
}
