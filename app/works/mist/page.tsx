import { pageMetadata } from '../../site-metadata';
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

export const metadata = pageMetadata('/works/mist');

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
