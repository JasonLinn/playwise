import { pageMetadata } from '../../site-metadata';
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

export const metadata = pageMetadata('/works/tide');

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
