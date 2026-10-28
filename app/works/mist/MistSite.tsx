"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MobileExplore from '../MobileExplore';
import styles from './mist.module.css';

const photo = (id: string, w = 1800) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// 二十四節氣（以常見的國曆日期近似，誤差約一天）
const TERMS: { name: string; m: number; d: number; line: string }[] = [
    { name: '小寒', m: 1, d: 5, line: '冬天上山，厚外套和襪子都帶著。晚上可以留在茶室喝熱茶。' },
    { name: '大寒', m: 1, d: 20, line: '怕冷的客人，入住時可以先問電毯怎麼使用。' },
    { name: '立春', m: 2, d: 4, line: '春天想看茶園，記得帶雙方便走路的鞋。' },
    { name: '雨水', m: 2, d: 19, line: '行李裡放一把傘。下雨的下午，茶室也有地方坐。' },
    { name: '驚蟄', m: 3, d: 5, line: '想在附近散步，抵達後再看天氣安排就好。' },
    { name: '春分', m: 3, d: 20, line: '白天逛茶園，傍晚回房休息。春天的行程不用排得太滿。' },
    { name: '清明', m: 4, d: 4, line: '連假上山，建議提早出發，也先安排好午餐。' },
    { name: '穀雨', m: 4, d: 20, line: '喜歡喝茶，可以留一個下午在茶室，試試不同的茶款。' },
    { name: '立夏', m: 5, d: 5, line: '天氣暖了，出門走走時記得帶水和防蚊用品。' },
    { name: '小滿', m: 5, d: 21, line: '戶外行程留點彈性，下雨就回來泡茶。' },
    { name: '芒種', m: 6, d: 5, line: '雨天石階容易濕滑，穿止滑的鞋會比較好走。' },
    { name: '夏至', m: 6, d: 21, line: '白天出門記得防曬，散步可以安排在傍晚。' },
    { name: '小暑', m: 7, d: 7, line: '中午先回房休息，等沒那麼曬了再出門。' },
    { name: '大暑', m: 7, d: 22, line: '夏天上山也要補充水分，別把戶外行程排得太趕。' },
    { name: '立秋', m: 8, d: 7, line: '帶件薄外套，晚上坐露台時用得上。' },
    { name: '處暑', m: 8, d: 23, line: '想住露台房，可以先看看白露房的格局。' },
    { name: '白露', m: 9, d: 7, line: '早起在露台喝杯茶，出門前再回房加件外套。' },
    { name: '秋分', m: 9, d: 22, line: '兩人小旅行，住一晚也可以；想多逛幾處茶園，就留兩晚。' },
    { name: '寒露', m: 10, d: 8, line: '山上起霧時能見度較低，開車請放慢，盡量白天抵達。' },
    { name: '霜降', m: 10, d: 23, line: '這時候上山，記得多帶一件外套。晚餐後可以來茶室坐坐。' },
    { name: '立冬', m: 11, d: 7, line: '冬天的行程可以簡單一點：吃早餐、走走，再回來喝茶。' },
    { name: '小雪', m: 11, d: 22, line: '下雨天帶本書來，房裡和茶室都能坐上一下午。' },
    { name: '大雪', m: 12, d: 7, line: '訂房前可以先問房內的保暖設備，帶長輩同行更好安排。' },
    { name: '冬至', m: 12, d: 21, line: '冬天較早天黑，建議吃過午餐就慢慢往山上走。' },
];

function termStart(year: number, i: number) {
    const k = ((i % 24) + 24) % 24;
    const y = year + Math.floor(i / 24);
    return new Date(y, TERMS[k].m - 1, TERMS[k].d);
}

function currentTermIndex(date: Date) {
    const y = date.getFullYear();
    let idx = -1; // 去年冬至
    TERMS.forEach((_, i) => {
        if (date >= termStart(y, i)) idx = i;
    });
    return idx;
}

function upcomingTerms(date: Date, count: number) {
    const y = date.getFullYear();
    const idx = currentTermIndex(date);
    return Array.from({ length: count }, (_, k) => {
        const i = idx + k;
        const start = termStart(y, i);
        const end = new Date(termStart(y, i + 1).getTime() - 86400000);
        return { name: TERMS[((i % 24) + 24) % 24].name, start, end, current: k === 0 };
    });
}

const md = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
const money = (n: number) => `NT$ ${n.toLocaleString('en-US')}`;

// 首屏字型獨立預載；頁面 load 後再啟用完整內文字型，減少首次載入競爭。
function useFullFonts() {
    const [full, setFull] = useState(false);
    useEffect(() => {
        let timer = 0;
        let idle = 0;
        // load 之後至少再等 1.2 秒、等瀏覽器閒下來，避免首次繪製較慢時內文字型被提早請求
        const go = () => {
            timer = window.setTimeout(() => {
                const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
                idle = ric(() => setFull(true), { timeout: 2000 });
            }, 1200);
        };
        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go, { once: true });
        return () => {
            window.removeEventListener('load', go);
            window.clearTimeout(timer);
            (window.cancelIdleCallback ?? window.clearTimeout)(idle);
        };
    }, []);
    return full;
}

type Room = {
    id: string;
    term: string;
    en: string;
    name: string;
    season: string;
    size: string;
    bed: string;
    guests: string;
    weekday: number;
    weekend: number;
    text: string;
    img: string;
    alt: string;
};

const ROOMS: Room[] = [
    {
        id: 'qingming',
        term: '清明',
        en: 'Qingming',
        name: '茶園雙人房',
        season: '兩人入住・面向茶園',
        size: '8 坪',
        bed: 'Queen 雙人床',
        guests: '2 人',
        weekday: 4200,
        weekend: 5200,
        text: '一張雙人床，窗戶面向茶園。兩個人來住，這間簡單、剛好；早上可以坐在窗邊喝茶。',
        img: '1617104678098-de229db51175',
        alt: '深色牆面的雙人房，大窗外是林木',
    },
    {
        id: 'guyu',
        term: '穀雨',
        en: 'Guyu',
        name: '老茶廠四人房',
        season: '四人同行・上下舖',
        size: '14 坪',
        bed: '木造上下舖兩組',
        guests: '4 人',
        weekday: 6800,
        weekend: 7800,
        text: '位在老茶廠二樓，保留木樑與木架，設兩組上下舖。適合四位朋友同行，訂房時請留意上舖需要爬梯。',
        img: '1520277739336-7bf67edfa768',
        alt: '深色老木頭打造的上下舖客房',
    },
    {
        id: 'bailu',
        term: '白露',
        en: 'Bailu',
        name: '露台雙人房',
        season: '兩人入住・獨立露台',
        size: '10 坪',
        bed: 'King 雙人床',
        guests: '2 人',
        weekday: 5600,
        weekend: 6600,
        text: '一張加大雙人床，房外有面山的半戶外露台。想在戶外喝茶、看看山景，可以選這間。',
        img: '1564078516393-cf04bd966897',
        alt: '黃昏時分的起居空間，大片落地窗外是山稜',
    },
    {
        id: 'shuangjiang',
        term: '霜降',
        en: 'Shuangjiang',
        name: '杉林獨棟木屋',
        season: '兩至三人・獨棟木屋',
        size: '16 坪',
        bed: 'King 雙人床＋臥榻',
        guests: '2–3 人',
        weekday: 8800,
        weekend: 9800,
        text: '獨棟木屋與主屋分開，房內有雙人床、臥榻和茶席。第三位入住需事先安排，也請先告知成人或孩子的人數。',
        img: '1595521624992-48a59aef95e3',
        alt: '林間的木造小屋，門前有木頭露台',
    },
];

const TEAS = [
    {
        id: 'baozhong',
        name: '文山包種',
        en: 'Wenshan Baozhong',
        temp: 90,
        grams: 4,
        base: 45,
        step: 10,
        color: '#b9a64a',
        note: '茶香清爽，帶淡淡花香。第一次泡，可以先從這款開始。',
    },
    {
        id: 'beauty',
        name: '東方美人',
        en: 'Oriental Beauty',
        temp: 85,
        grams: 3,
        base: 50,
        step: 15,
        color: '#c27a2e',
        note: '帶蜜香與熟果香，喜歡香氣濃一些的客人可以試試。',
    },
    {
        id: 'black',
        name: '坪林紅茶',
        en: 'Pinglin Black',
        temp: 95,
        grams: 3,
        base: 60,
        step: 20,
        color: '#8e3b1d',
        note: '味道較醇厚。泡好先喝一口，再依喜好調整下一泡的時間。',
    },
];

const GALLERY = [
    { id: '1542273917363-3b1817f69a2d', time: '06:10', text: '清晨的山霧' },
    { id: '1571934811356-5cc061b6821f', time: '08:30', text: '文山包種，第三泡' },
    { id: '1500534314209-a25ddb2bd429', time: '17:40', text: '傍晚的山景' },
    { id: '1473448912268-2022ce9509d8', time: '10:00', text: '林間散步' },
    { id: '1563822249366-3efb23b8e0c9', time: '15:00', text: '春茶、冬茶、東方美人' },
    { id: '1448375240586-882707db888b', time: '07:20', text: '晨光裡的樹林' },
    { id: '1519681393784-d120267933ba', time: '23:00', text: '山裡的星空' },
];

const SECTIONS = [
    { id: 'top', label: '霧' },
    { id: 'house', label: '山房' },
    { id: 'rooms', label: '節氣' },
    { id: 'tea', label: '一盞茶' },
    { id: 'views', label: '風景' },
    { id: 'reserve', label: '預約' },
];
const KANJI_NUM = ['一', '二', '三', '四', '五', '六'];

export default function MistSite() {
    const rootRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const [today, setToday] = useState<Date | null>(null);
    const [section, setSection] = useState('top');
    const [activeRoom, setActiveRoom] = useState(ROOMS[0].id);
    const [ready, setReady] = useState(false);
    const fullFonts = useFullFonts();

    useEffect(() => {
        setToday(new Date());
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // 進場淡入
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.setAttribute('data-visible', '');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
        );
        root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    // 目前所在的區段（側欄）與房間（固定圖片）
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const band = { rootMargin: '-45% 0px -50% 0px' };
        const sectionIo = new IntersectionObserver((entries) => {
            entries.forEach((e) => e.isIntersecting && setSection(e.target.id));
        }, band);
        SECTIONS.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) sectionIo.observe(el);
        });
        const roomIo = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                const id = (e.target as HTMLElement).dataset.room;
                if (e.isIntersecting && id) setActiveRoom(id);
            });
        }, band);
        root.querySelectorAll('[data-room]').forEach((el) => roomIo.observe(el));
        return () => {
            sectionIo.disconnect();
            roomIo.disconnect();
        };
    }, []);

    // 首屏：往下捲，像走進霧裡
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;
        let raf = 0;
        const update = () => {
            raf = 0;
            const p = clamp(window.scrollY / window.innerHeight, 0, 1);
            heroRef.current?.style.setProperty('--p', p.toFixed(4));
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    const termIdx = today ? currentTermIndex(today) : null;
    const term = termIdx !== null ? TERMS[((termIdx % 24) + 24) % 24] : null;

    return (
        <div ref={rootRef} className={styles.site} data-ready={ready ? 'true' : 'false'} data-fonts={fullFonts ? 'full' : 'hero'}>
            <a href="#house" className={styles.skip}>跳到主要內容</a>
            <noscript>
                <style>{`.${styles.site}{--f-serif:'Mist Hero',var(--font-zh-serif),serif}.${styles.site} [data-reveal]{opacity:1;transform:none;filter:none}`}</style>
            </noscript>

            {/* 側欄（桌機）／頂欄（手機） */}
            <nav className={styles.rail} aria-label="主選單">
                <a href="#top" className={styles.railBrand}>
                    <span className={styles.railZh}>霧裡山房</span>
                    <span className={styles.railEn}>Mist House</span>
                </a>
                <ol className={styles.railIndex}>
                    {SECTIONS.map((s, i) => (
                        <li key={s.id}>
                            <a href={`#${s.id}`} aria-current={section === s.id ? 'true' : undefined}>
                                <span className={styles.railNum}>{KANJI_NUM[i]}</span>
                                <span className={styles.railLabel}>{s.label}</span>
                            </a>
                        </li>
                    ))}
                </ol>
                <div className={styles.railActions}>
                    <MobileExplore tone="dark" links={[{ href: '#house', label: '山房介紹' }, { href: '#rooms', label: '房型介紹' }, { href: '#tea', label: '泡茶計時器' }, { href: '#views', label: '山居風景' }, { href: '#reserve', label: '住宿詢問' }]} />
                    <a href="#reserve" className={styles.railCta}>預約</a>
                </div>
            </nav>

            {/* 首屏 */}
            <header id="top" ref={heroRef} className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src={photo('1418065460487-3e41a6c84dc5', 2400)}
                        alt="被濃霧籠罩的杉木林，樹梢消失在白霧中"
                        fill
                        preload
                        sizes="100vw"
                    />
                </div>
                <div className={styles.fog} aria-hidden="true">
                    <i /><i /><i />
                </div>
                <FogWipe hostRef={heroRef} />
                <div className={styles.heroDusk} aria-hidden="true" />
                <p className={styles.concept}>02 / CONCEPT STAY<span>虛構民宿・官網設計作品</span></p>

                <h1 className={styles.heroTitle}>
                    <span className={styles.srOnly}>霧裡山房 — 坪林茶園民宿</span>
                    {'霧裡山房'.split('').map((c, i) => (
                        <span key={c} aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>{c}</span>
                    ))}
                </h1>

                <div className={styles.heroCopy}>
                    <p className={styles.heroEn}>
                        A tea house <em>in the mist.</em>
                    </p>
                    <p className={styles.heroZh}>坪林茶山・四間客房・入住喝一杯茶</p>
                </div>

                <dl className={styles.heroData}>
                    <div><dt>ROOMS</dt><dd>4</dd></div>
                    <div><dt>CHECK-IN</dt><dd>15:00</dd></div>
                    <div><dt>CHECK-OUT</dt><dd>11:00</dd></div>
                    <div><dt>節氣</dt><dd>{term ? term.name : '—'}</dd></div>
                </dl>

                <a href="#house" className={styles.heroScroll}>
                    <span>認識山房</span>
                    <i aria-hidden="true" />
                </a>
            </header>

            <main>
                {/* 山房 */}
                <section id="house" className={styles.house} aria-labelledby="house-title">
                    <h2 id="house-title" className={styles.srOnly}>關於霧裡山房</h2>
                    <div className={styles.poem} data-reveal>
                        <p>到了，</p>
                        <p>先坐下來</p>
                        <p>喝杯茶。</p>
                    </div>
                    <div className={styles.houseBody}>
                        <p className={styles.kicker} data-reveal>
                            <span>01</span> The House
                        </p>
                        <p className={styles.houseLead} data-reveal>
                            我們把老茶廠整理成四間客房，保留木樑，也留了一間大家可以坐下喝茶的茶室。抵達後先放好行李，喝杯茶，再慢慢辦入住。
                        </p>
                        <p className={styles.houseText} data-reveal>
                            山房適合想在山裡住一兩晚的客人。白天逛茶園、走走附近步道，下雨就留在屋裡。這裡離市區有段路，晚餐和交通先安排好，住起來會更自在。
                        </p>
                        <figure className={styles.houseFigure} data-reveal>
                            <div className={styles.houseImg}>
                                <Image src={photo('1564890369478-c89ca6d9cde9', 1400)} alt="木托盤上的白色茶壺與一杯熱茶" fill sizes="(min-width: 1024px) 36vw, 90vw" />
                            </div>
                            <figcaption>入住時先喝杯茶。喜歡哪一款，可以再向我們詢問。</figcaption>
                        </figure>
                    </div>
                </section>

                {/* 此刻節氣 */}
                <section className={styles.now} aria-label="此刻的節氣" data-reveal>
                    {today && termIdx !== null && <SolarRing today={today} idx={termIdx} />}
                    <p className={styles.nowLabel}>此刻・坪林</p>
                    <p className={styles.nowTerm}>{term ? term.name : '　　'}</p>
                    <p className={styles.nowLine}>{term ? term.line : ' '}</p>
                </section>

                {/* 節氣房間：左圖固定、右文捲動 */}
                <section id="rooms" className={styles.rooms} aria-labelledby="rooms-title">
                    <header className={styles.roomsHead} data-reveal>
                        <p className={styles.kicker}><span>02</span> Rooms</p>
                        <h2 id="rooms-title" className={styles.title}>四間房，<br />四個節氣。</h2>
                        <p className={styles.lead}>
                            房名取自清明、穀雨、白露與霜降，全年都能入住。從兩人小旅行到四人同行，依照人數和喜歡的空間來選就好。
                        </p>
                    </header>

                    <div className={styles.roomsBody}>
                        <div className={styles.roomStage} aria-hidden="true">
                            {ROOMS.map((r) => (
                                <div key={r.id} className={styles.roomStageImg} data-on={activeRoom === r.id ? 'true' : 'false'}>
                                    <Image src={photo(r.img, 1600)} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" />
                                </div>
                            ))}
                            <div className={styles.roomStageTerm}>
                                {ROOMS.map((r) => (
                                    <span key={r.id} data-on={activeRoom === r.id ? 'true' : 'false'}>{r.term}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.roomTexts}>
                            {ROOMS.map((r, i) => (
                                <article key={r.id} data-room={r.id} className={styles.roomText} data-on={activeRoom === r.id ? 'true' : 'false'}>
                                    <div className={styles.roomMobileImg}>
                                        <Image src={photo(r.img, 1000)} alt={r.alt} fill sizes="100vw" />
                                    </div>
                                    <p className={styles.roomIndex}>
                                        <span>{String(i + 1).padStart(2, '0')}</span>
                                        <span>{r.season}</span>
                                    </p>
                                    <h3 className={styles.roomName}>
                                        <span className={styles.roomTerm}>{r.term}</span>
                                        <span className={styles.roomSub}>
                                            <em>{r.en}</em>
                                            {r.name}
                                        </span>
                                    </h3>
                                    <p className={styles.roomBody}>{r.text}</p>
                                    <dl className={styles.roomSpecs}>
                                        <div><dt>坪數</dt><dd>{r.size}</dd></div>
                                        <div><dt>床型</dt><dd>{r.bed}</dd></div>
                                        <div><dt>入住</dt><dd>{r.guests}</dd></div>
                                        <div><dt>平日／假日</dt><dd>{money(r.weekday)}／{money(r.weekend)}</dd></div>
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 一盞茶 */}
                <TeaRitual />

                {/* 數字 */}
                <section className={styles.facts} aria-label="山房住宿資訊">
                    {[
                        ['4', 'ROOMS', '四種格局，依同行人數選房'],
                        ['3', 'TEAS', '包種、東方美人與紅茶'],
                        ['15', ':00', '下午三點後入住'],
                        ['11', ':00', '上午十一點前退房'],
                    ].map(([n, unit, label]) => (
                        <div key={label} className={styles.fact} data-reveal>
                            <p className={styles.factNum}>{n}<small>{unit}</small></p>
                            <p className={styles.factLabel}>{label}</p>
                        </div>
                    ))}
                </section>

                {/* 風景 */}
                <Gallery />

                {/* 住宿資訊 */}
                <section className={styles.info} aria-labelledby="info-title">
                    <header data-reveal>
                        <p className={styles.kicker}><span>05</span> Stay</p>
                        <h2 id="info-title" className={styles.title}>住之前，<br />先知道的事。</h2>
                    </header>
                    <dl className={styles.infoList} data-reveal>
                        <div><dt>入住／退房</dt><dd>15:00 後入住，11:00 前退房。若會晚到，請提前告知預計抵達時間。</dd></div>
                        <div><dt>早餐</dt><dd>08:00–09:30 在茶室供應，菜色依當日準備。有素食或食材過敏需求，請事先告知。</dd></div>
                        <div><dt>交通</dt><dd>以自行開車為主，建議天黑前抵達。此為虛構民宿作品，未提供實際地址或導航位置。</dd></div>
                        <div><dt>同行人數</dt><dd>請一併告知成人、孩子的人數與年齡，方便確認床位。杉林木屋的第三位入住需事先安排。</dd></div>
                        <div><dt>房內設備</dt><dd>每間房備有茶具與電毯，Wi-Fi 在茶室使用。若需要穩定網路辦公，請先評估是否適合。</dd></div>
                        <div><dt>訂房確認</dt><dd>選好房型後，還需要確認入住日期、房費與取消辦法。本頁僅示範詢問流程，不收取訂金。</dd></div>
                    </dl>
                </section>

                {/* 預約 */}
                <Reserve today={today} />
            </main>

            <footer className={styles.footer}>
                <p className={styles.footerLine}>下次有空，再上山住兩天。</p>
                <div className={styles.footerGrid}>
                    <p>霧裡山房 Mist House<br />新北市坪林區（示範地址）</p>
                    <p>概念設計・未提供聯絡帳號<br />此頁不接受實際預訂</p>
                    <p>虛構品牌・非營業旅宿<br />影像為情境素材，非實景</p>
                    <p><Link href="/#portfolio">Website by 智遊工作室<br />Concept work ←</Link></p>
                </div>
            </footer>

            <Link href="/#portfolio" className={styles.studioBadge}>
                <span aria-hidden="true">←</span> 智遊工作室・概念民宿
            </Link>
        </div>
    );
}

// 二十四節氣的環：一年是一圈，標出現在走到哪裡（取代照片的原創圖）
function SolarRing({ today, idx }: { today: Date; idx: number }) {
    const R = 62;
    const C = 80;
    const y = today.getFullYear();
    const start = termStart(y, idx).getTime();
    const end = termStart(y, idx + 1).getTime();
    const k = ((idx % 24) + 24) % 24;
    const frac = (k + (today.getTime() - start) / (end - start)) / 24;
    const at = (f: number, r: number) => {
        const a = f * Math.PI * 2 - Math.PI / 2;
        return [C + Math.cos(a) * r, C + Math.sin(a) * r];
    };
    const [sx, sy] = at(k / 24, R);
    const [ex, ey] = at((k + 1) / 24, R);
    const [px, py] = at(frac, R);
    return (
        <svg className={styles.ring} viewBox="0 0 160 160" role="img" aria-label={`二十四節氣，現在是第 ${k + 1} 個：${TERMS[k].name}`}>
            <circle cx={C} cy={C} r={R} className={styles.ringTrack} />
            {TERMS.map((t, i) => {
                const [x1, y1] = at(i / 24, R - 5);
                const [x2, y2] = at(i / 24, R + (i % 6 === 2 ? 9 : 5));
                return <line key={t.name} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.ringTick} />;
            })}
            <path d={`M${sx} ${sy} A${R} ${R} 0 0 1 ${ex} ${ey}`} className={styles.ringArc} />
            <circle cx={px} cy={py} r="4" className={styles.ringNow} />
            {[['立春', 2], ['立夏', 8], ['立秋', 14], ['立冬', 20]].map(([name, i]) => {
                const [x, yy] = at((i as number) / 24, R - 22);
                return (
                    <text key={name} x={x} y={yy} textAnchor="middle" dominantBaseline="middle" className={styles.ringLabel}>
                        {(name as string)[1]}
                    </text>
                );
            })}
        </svg>
    );
}

// 首屏的「起霧的窗」：滑鼠或手指劃過的地方，霧會被擦開，幾秒後再慢慢凝回來
function FogWipe({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [wiped, setWiped] = useState(false);

    useEffect(() => {
        const host = hostRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!host || !canvas || !ctx) return;

        // 低解析度繪製再放大，邊緣自然柔和，也省效能
        const SCALE = 0.25;
        const mask = document.createElement('canvas');
        const mctx = mask.getContext('2d');
        if (!mctx) return;
        let w = 0;
        let h = 0;
        let raf = 0;
        let lastWipe = 0;
        let last: { x: number; y: number } | null = null;

        const paint = () => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, w, h);
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, 'rgba(238, 240, 236, 0.62)');
            g.addColorStop(0.55, 'rgba(226, 231, 226, 0.5)');
            g.addColorStop(1, 'rgba(210, 216, 210, 0.12)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(mask, 0, 0);
        };

        const resize = () => {
            w = mask.width = canvas.width = Math.max(1, Math.round(host.clientWidth * SCALE));
            h = mask.height = canvas.height = Math.max(1, Math.round(host.clientHeight * SCALE));
            paint();
        };

        const loop = () => {
            // 擦痕每一幀淡掉一點，霧就慢慢凝回來
            mctx.globalCompositeOperation = 'destination-out';
            mctx.fillStyle = 'rgba(0, 0, 0, 0.012)';
            mctx.fillRect(0, 0, w, h);
            paint();
            raf = performance.now() - lastWipe < 7000 ? requestAnimationFrame(loop) : 0;
            if (!raf) {
                mctx.clearRect(0, 0, w, h);
                paint();
            }
        };

        const dab = (x: number, y: number) => {
            const r = Math.max(w, h) * 0.07;
            const g = mctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
            g.addColorStop(1, 'rgba(0, 0, 0, 0)');
            mctx.fillStyle = g;
            mctx.fillRect(x - r, y - r, r * 2, r * 2);
        };

        const onMove = (e: PointerEvent) => {
            const rect = host.getBoundingClientRect();
            if (e.clientY > rect.bottom) return;
            const x = (e.clientX - rect.left) * SCALE;
            const y = (e.clientY - rect.top) * SCALE;
            mctx.globalCompositeOperation = 'source-over';
            // 沿著移動路徑補點，快速劃過也是連續的一道
            const from = last ?? { x, y };
            const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / 3));
            for (let i = 1; i <= steps; i++) {
                dab(from.x + ((x - from.x) * i) / steps, from.y + ((y - from.y) * i) / steps);
            }
            last = { x, y };
            lastWipe = performance.now();
            setWiped(true);
            if (!raf) raf = requestAnimationFrame(loop);
        };
        const onLeave = () => {
            last = null;
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);
        host.addEventListener('pointermove', onMove);
        host.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            host.removeEventListener('pointermove', onMove);
            host.removeEventListener('pointerleave', onLeave);
        };
    }, [hostRef]);

    return (
        <>
            <canvas ref={canvasRef} className={styles.fogCanvas} aria-hidden="true" />
            <p className={styles.fogHint} data-hidden={wiped ? 'true' : 'false'} aria-hidden="true">
                <span className={styles.fogHintFine}>移動滑鼠，擦開窗上的霧</span>
                <span className={styles.fogHintTouch}>用手指劃過，擦開窗上的霧</span>
            </p>
        </>
    );
}

function TeaRitual() {
    const [teaId, setTeaId] = useState(TEAS[0].id);
    const [infusion, setInfusion] = useState(1);
    const [endAt, setEndAt] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [done, setDone] = useState(false);

    const tea = TEAS.find((t) => t.id === teaId) ?? TEAS[0];
    const duration = tea.base + (infusion - 1) * tea.step;
    const left = remaining ?? duration;
    const progress = 1 - left / duration;
    const running = endAt !== null;

    useEffect(() => {
        if (endAt === null) return;
        const tick = () => {
            const ms = endAt - Date.now();
            if (ms <= 0) {
                setRemaining(0);
                setEndAt(null);
                setDone(true);
                return;
            }
            setRemaining(ms / 1000);
        };
        tick();
        const id = window.setInterval(tick, 100);
        return () => window.clearInterval(id);
    }, [endAt]);

    const reset = (nextInfusion = 1) => {
        setEndAt(null);
        setRemaining(null);
        setDone(false);
        setInfusion(nextInfusion);
    };

    const toggle = () => {
        if (running) {
            setEndAt(null); // 暫停，保留剩餘秒數
            return;
        }
        if (done) {
            reset(infusion + 1);
            return;
        }
        setEndAt(Date.now() + left * 1000);
    };

    const r = 118;
    const c = 2 * Math.PI * r;
    const secs = Math.ceil(left);

    return (
        <section id="tea" className={styles.tea} aria-labelledby="tea-title">
            <div className={styles.teaIntro} data-reveal>
                <p className={styles.kicker}><span>03</span> Tea</p>
                <h2 id="tea-title" className={styles.title}>泡一壺，坐一下。</h2>
                <p className={styles.lead}>
                    房裡備有茶具，不常泡茶也沒關係。先選一款，照著下方的水溫、茶量與計時器試泡；味道太濃或太淡，下一泡再調整時間。
                </p>

                <div className={styles.teaPicker} role="radiogroup" aria-label="選擇茶款">
                    {TEAS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={t.id === teaId}
                            className={styles.teaOption}
                            style={{ '--tea': t.color } as React.CSSProperties}
                            onClick={() => {
                                setTeaId(t.id);
                                reset(1);
                            }}
                        >
                            <span className={styles.teaSwatch} aria-hidden="true" />
                            <span className={styles.teaName}>{t.name}</span>
                            <span className={styles.teaEn}>{t.en}</span>
                        </button>
                    ))}
                </div>
                <p className={styles.teaNote}>{tea.note}</p>
            </div>

            <div className={styles.teaStage} data-reveal style={{ '--tea': tea.color, '--fill': progress.toFixed(4) } as React.CSSProperties}>
                <div className={styles.cup}>
                    <div className={styles.cupLiquid} aria-hidden="true">
                        <i />
                    </div>
                    <svg className={styles.cupRing} viewBox="0 0 260 260" aria-hidden="true">
                        <circle cx="130" cy="130" r={r} className={styles.cupTrack} />
                        <circle
                            cx="130"
                            cy="130"
                            r={r}
                            className={styles.cupProgress}
                            strokeDasharray={c}
                            strokeDashoffset={c * (1 - progress)}
                        />
                    </svg>
                    <div className={styles.cupReadout}>
                        <span className={styles.cupInfusion}>第 {infusion} 泡</span>
                        <span className={styles.cupSecs} aria-hidden="true">{done ? '出湯' : secs}</span>
                        <span className={styles.cupUnit}>{done ? 'Pour now' : 'seconds'}</span>
                    </div>
                </div>

                <dl className={styles.teaSpecs}>
                    <div><dt>水溫</dt><dd>{tea.temp}°C</dd></div>
                    <div><dt>茶葉</dt><dd>{tea.grams} g / 150 ml</dd></div>
                    <div><dt>這一泡</dt><dd>{duration} 秒</dd></div>
                </dl>

                <div className={styles.teaActions}>
                    <button type="button" className={styles.teaPrimary} onClick={toggle}>
                        {running ? '暫停' : done ? `泡第 ${infusion + 1} 泡` : remaining !== null ? '繼續' : '開始沖泡'}
                    </button>
                    <button type="button" className={styles.teaGhost} onClick={() => reset(1)} disabled={!running && remaining === null && infusion === 1}>
                        重來
                    </button>
                </div>
                <p className={styles.srOnly} role="status" aria-live="polite">
                    {done ? `第 ${infusion} 泡完成，可以出湯了。` : running ? `${tea.name}第 ${infusion} 泡，計時 ${duration} 秒。` : ''}
                </p>
            </div>
        </section>
    );
}

function Gallery() {
    const trackRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

    const scrollByCard = (dir: number) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.querySelector('figure');
        const w = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
        el.scrollBy({ left: dir * w, behavior: 'smooth' });
    };

    return (
        <section id="views" className={styles.gallery} aria-labelledby="views-title">
            <header className={styles.galleryHead} data-reveal>
                <div>
                    <p className={styles.kicker}><span>04</span> Views</p>
                    <h2 id="views-title" className={styles.title}>從窗戶看出去。</h2>
                </div>
                <div className={styles.galleryNav}>
                    <button type="button" onClick={() => scrollByCard(-1)} aria-label="上一張">←</button>
                    <button type="button" onClick={() => scrollByCard(1)} aria-label="下一張">→</button>
                </div>
            </header>
            <div
                ref={trackRef}
                className={styles.galleryTrack}
                onPointerDown={(e) => {
                    if (e.pointerType !== 'mouse' || !trackRef.current) return;
                    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
                    trackRef.current.dataset.dragging = 'true';
                }}
                onPointerMove={(e) => {
                    const d = drag.current;
                    const el = trackRef.current;
                    if (!d || !el) return;
                    const dx = e.clientX - d.x;
                    if (Math.abs(dx) > 4) d.moved = true;
                    el.scrollLeft = d.left - dx;
                }}
                onPointerUp={() => {
                    drag.current = null;
                    if (trackRef.current) delete trackRef.current.dataset.dragging;
                }}
                onPointerLeave={() => {
                    drag.current = null;
                    if (trackRef.current) delete trackRef.current.dataset.dragging;
                }}
            >
                {GALLERY.map((g, i) => (
                    <figure key={g.id} className={styles.galleryCard} data-shape={i % 3}>
                        <div className={styles.galleryImg}>
                            <Image src={photo(g.id, 1200)} alt={g.text} fill sizes="(min-width: 1024px) 34vw, 80vw" draggable={false} />
                        </div>
                        <figcaption>
                            <span>{g.time}</span>
                            {g.text}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}

function Reserve({ today }: { today: Date | null }) {
    const terms = useMemo(() => (today ? upcomingTerms(today, 4) : []), [today]);
    const [termPick, setTermPick] = useState(0);
    const [roomId, setRoomId] = useState(ROOMS[3].id);
    const [nights, setNights] = useState(1);

    const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

    return (
        <section id="reserve" className={styles.reserve} aria-labelledby="reserve-title">
            <div className={styles.reserveIntro} data-reveal>
                <p className={styles.kicker}><span>06</span> Reserve</p>
                <h2 id="reserve-title" className={styles.reserveTitle}>
                    想什麼時候來住？
                </h2>
                <p className={styles.lead}>
                    日期還沒決定，可以先選大致時段、房型和住宿晚數，看看房費。此處為試算示範，不會保留房間。
                </p>
            </div>

            <div className={styles.reserveGrid} data-reveal>
                <div className={styles.reserveForm}>
                    <fieldset>
                        <legend>預計入住時段</legend>
                        <div className={styles.chips}>
                            {terms.map((x, i) => (
                                <label key={x.name} className={styles.chip} data-checked={i === termPick ? 'true' : 'false'}>
                                    <input type="radio" name="term" checked={i === termPick} onChange={() => setTermPick(i)} />
                                    <span className={styles.chipTerm}>{x.name}</span>
                                    <span className={styles.chipDate}>{md(x.start)}–{md(x.end)}</span>
                                    {x.current && <span className={styles.chipNow}>現在</span>}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>房型</legend>
                        <div className={styles.chips}>
                            {ROOMS.map((r) => (
                                <label key={r.id} className={styles.chip} data-checked={r.id === roomId ? 'true' : 'false'}>
                                    <input type="radio" name="room" checked={r.id === roomId} onChange={() => setRoomId(r.id)} />
                                    <span className={styles.chipTerm}>{r.term}</span>
                                    <span className={styles.chipDate}>{r.name}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <div className={styles.nights}>
                        <span id="nights-label">住幾晚</span>
                        <div role="group" aria-labelledby="nights-label">
                            {[1, 2, 3].map((n) => (
                                <button key={n} type="button" aria-pressed={n === nights} onClick={() => setNights(n)}>
                                    {n} 晚
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className={styles.estimate}>
                        房費試算 <strong>{money(room.weekday * nights)}</strong> 起
                        <span>以平日計算；假日每晚 {money(room.weekend)}。示範房價，非實際報價。</span>
                    </p>
                </div>

            </div>
        </section>
    );
}
