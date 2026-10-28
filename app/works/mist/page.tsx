import type { Metadata } from 'next';
import localFont from 'next/font/local';
// 首屏字型（首屏中文＋英文展示字型）以 base64 內嵌，不產生額外請求。由 scripts/subset-case-fonts.mjs 產生
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
    description: '海拔 480 公尺、一年兩百天起霧的坪林茶園民宿。以節氣命名的四間房、一盞包種茶的時間。民宿官網設計示範：霧氣捲動、即時節氣、泡茶計時器與 LINE 預約。',
    openGraph: {
        title: '霧裡山房 Mist House｜坪林茶園民宿',
        description: '山在霧裡，茶在杯裡，人在時間之外。',
        images: ['https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1200&h=630&q=80'],
    },
};

export default function MistPage() {
    return (
        <div className={zhSerif.variable}>
            <MistSite />
        </div>
    );
}
