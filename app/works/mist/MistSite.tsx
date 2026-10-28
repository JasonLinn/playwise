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
    { name: '小寒', m: 1, d: 5, line: '最冷的時候。圍爐、焙火，喝一壺熟香的老茶。' },
    { name: '大寒', m: 1, d: 20, line: '山上偶爾結霜。茶樹休眠，我們也跟著休息。' },
    { name: '立春', m: 2, d: 4, line: '茶芽還在睡，霧開始變得溫柔。' },
    { name: '雨水', m: 2, d: 19, line: '春雨落進北勢溪，茶園冒出第一抹新綠。' },
    { name: '驚蟄', m: 3, d: 5, line: '雷聲過後，茶芽醒了。' },
    { name: '春分', m: 3, d: 20, line: '日夜等長，山上的茶開始抽芽。' },
    { name: '清明', m: 4, d: 4, line: '明前的嫩芽最珍貴，採茶人天亮就上山。' },
    { name: '穀雨', m: 4, d: 20, line: '春茶最好的時節，整座山都是製茶的香氣。' },
    { name: '立夏', m: 5, d: 5, line: '螢火蟲出現在溪邊的草叢裡。' },
    { name: '小滿', m: 5, d: 21, line: '夏茶開始採收，午後常有雷陣雨。' },
    { name: '芒種', m: 6, d: 5, line: '梅雨季，一年裡霧最濃的月份之一。' },
    { name: '夏至', m: 6, d: 21, line: '白天最長，傍晚到溪裡泡腳。' },
    { name: '小暑', m: 7, d: 7, line: '蟬聲很大，綠茶很清涼。' },
    { name: '大暑', m: 7, d: 22, line: '最熱的時候，山上仍比台北低五度。' },
    { name: '立秋', m: 8, d: 7, line: '早晚開始有一點涼意。' },
    { name: '處暑', m: 8, d: 23, line: '暑氣漸消，可以開始喝一點焙火的茶。' },
    { name: '白露', m: 9, d: 7, line: '清晨的草葉掛滿露水，秋茶準備採收。' },
    { name: '秋分', m: 9, d: 22, line: '秋茶的香氣，比春茶更沉一些。' },
    { name: '寒露', m: 10, d: 8, line: '霧回來了，每天早上都有看見雲海的機會。' },
    { name: '霜降', m: 10, d: 23, line: '早晚溫差大，霧最常在清晨出現。這是冬茶前的最後一段秋天。' },
    { name: '立冬', m: 11, d: 7, line: '冬茶採收開始，產量少、香氣足。' },
    { name: '小雪', m: 11, d: 22, line: '山上常常飄著細雨，適合窩在房裡讀書。' },
    { name: '大雪', m: 12, d: 7, line: '壁爐生火的季節。' },
    { name: '冬至', m: 12, d: 21, line: '吃一碗湯圓，配一杯冬茶。' },
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

// 首屏只用內嵌的小字型；頁面 load 完、瀏覽器閒下來之後，才讓 CSS 引用完整的內文字型。
// 實測：只要內文字型在首次繪製前被請求，手機 Lighthouse 就會掉 8–10 分。
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
        season: '四月初・春茶初採',
        size: '8 坪',
        bed: 'Queen 雙人床',
        guests: '2 人',
        weekday: 4200,
        weekend: 5200,
        text: '窗戶正對著茶園。四月的清晨，可以看見採茶人戴著斗笠，一個一個走進霧裡。',
        img: '1617104678098-de229db51175',
        alt: '深色牆面的雙人房，大窗外是林木',
    },
    {
        id: 'guyu',
        term: '穀雨',
        en: 'Guyu',
        name: '老茶廠四人房',
        season: '四月下旬・春茶正好',
        size: '14 坪',
        bed: '木造上下舖兩組',
        guests: '4 人',
        weekday: 6800,
        weekend: 7800,
        text: '原本是揉捻茶葉的二樓。我們留下檜木樑和老木架，改成四個床位——就像小時候在阿公家過夜。',
        img: '1520277739336-7bf67edfa768',
        alt: '深色老木頭打造的上下舖客房',
    },
    {
        id: 'bailu',
        term: '白露',
        en: 'Bailu',
        name: '露台雙人房',
        season: '九月初・秋露初生',
        size: '10 坪',
        bed: 'King 雙人床',
        guests: '2 人',
        weekday: 5600,
        weekend: 6600,
        text: '有一座面山的半戶外露台。秋天的清晨，欄杆上會掛滿一顆一顆的露水。',
        img: '1564078516393-cf04bd966897',
        alt: '黃昏時分的起居空間，大片落地窗外是山稜',
    },
    {
        id: 'shuangjiang',
        term: '霜降',
        en: 'Shuangjiang',
        name: '杉林獨棟木屋',
        season: '十月下旬・冬茶之前',
        size: '16 坪',
        bed: 'King 雙人床＋臥榻',
        guests: '2–3 人',
        weekday: 8800,
        weekend: 9800,
        text: '藏在杉木林裡的獨棟小屋，有自己的壁爐和茶席。最冷的夜裡，最好住。',
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
        note: '坪林的招牌。花香清揚，第一泡別泡太久。',
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
        note: '被小綠葉蟬叮咬過的茶葉，帶著蜂蜜和熟果的香氣。',
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
        note: '用在地小葉種做的紅茶，適合下雨的午後。',
    },
];

const GALLERY = [
    { id: '1542273917363-3b1817f69a2d', time: '06:10', text: '霧從北勢溪谷升起' },
    { id: '1571934811356-5cc061b6821f', time: '08:30', text: '文山包種，第三泡' },
    { id: '1500534314209-a25ddb2bd429', time: '17:40', text: '遠方的雪山山脈' },
    { id: '1473448912268-2022ce9509d8', time: '10:00', text: '北勢溪上游的早晨' },
    { id: '1563822249366-3efb23b8e0c9', time: '15:00', text: '春茶、冬茶、東方美人' },
    { id: '1448375240586-882707db888b', time: '07:20', text: '茶園後方的杉木林' },
    { id: '1519681393784-d120267933ba', time: '23:00', text: '沒有光害的夜' },
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
                    <MobileExplore tone="dark" links={[{ href: '#house', label: '霧裡的山房' }, { href: '#rooms', label: '四間節氣房' }, { href: '#tea', label: '一盞茶的時間' }, { href: '#views', label: '窗外風景' }, { href: '#reserve', label: '預約訊息預覽' }]} />
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
                <p className={styles.concept}>02 / CONCEPT STAY<span>虛構民宿・互動設計提案</span></p>

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
                    <p className={styles.heroZh}>坪林・北勢溪上游・三代茶農的老茶廠</p>
                </div>

                <dl className={styles.heroData}>
                    <div><dt>ALT</dt><dd>480 M</dd></div>
                    <div><dt>LAT</dt><dd>24°56′N</dd></div>
                    <div><dt>LNG</dt><dd>121°42′E</dd></div>
                    <div><dt>節氣</dt><dd>{term ? term.name : '—'}</dd></div>
                </dl>

                <a href="#house" className={styles.heroScroll}>
                    <span>往霧裡走</span>
                    <i aria-hidden="true" />
                </a>
            </header>

            <main>
                {/* 山房 */}
                <section id="house" className={styles.house} aria-labelledby="house-title">
                    <h2 id="house-title" className={styles.srOnly}>關於霧裡山房</h2>
                    <div className={styles.poem} data-reveal>
                        <p>山在霧裡，</p>
                        <p>茶在杯裡，</p>
                        <p>人在時間之外。</p>
                    </div>
                    <div className={styles.houseBody}>
                        <p className={styles.kicker} data-reveal>
                            <span>01</span> The House
                        </p>
                        <p className={styles.houseLead} data-reveal>
                            一九六二年，阿公在北勢溪上游蓋了這間製茶廠。六十年後，我們把揉茶的二樓改成客房，把烘焙間改成茶室，留下會吱嘎作響的檜木地板。
                        </p>
                        <p className={styles.houseText} data-reveal>
                            這裡一年有兩百多天起霧。早上推開窗，常常什麼都看不見，只聽得到溪水聲和遠處的鳥。等太陽出來，霧會一層一層散開，茶園才慢慢浮出來——我們覺得，這就是住在山裡最好的時刻。
                        </p>
                        <figure className={styles.houseFigure} data-reveal>
                            <div className={styles.houseImg}>
                                <Image src={photo('1564890369478-c89ca6d9cde9', 1400)} alt="木托盤上的白色茶壺與一杯熱茶" fill sizes="(min-width: 1024px) 36vw, 90vw" />
                            </div>
                            <figcaption>茶室的午後。每位客人入住時，都會先喝一杯今年的春茶。</figcaption>
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
                            每間房用一個節氣命名，那是它最好住的時候。當然，霧不分季節，任何時候來都可以。
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
                <section className={styles.facts} aria-label="關於這座山的幾個數字">
                    {[
                        ['480', 'M', '海拔。比台北盆地涼五到六度'],
                        ['200', '+', '一年裡起霧的天數'],
                        ['40', 'MIN', '從台北走國道五號'],
                        ['3', 'GEN', '三代茶農，自己種、自己做'],
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
                        <div><dt>入住／退房</dt><dd>15:00 後入住，11:00 前退房。晚到請先告訴我們，山路沒有路燈。</dd></div>
                        <div><dt>早餐</dt><dd>茶粥、山蘇、溪蝦與自家醃的醬菜。八點在茶室，九點半收。</dd></div>
                        <div><dt>交通</dt><dd>國道五號坪林交流道下，車程約 8 分鐘。最後 1.2 公里是單線產業道路，會車請禮讓。</dd></div>
                        <div><dt>公車</dt><dd>捷運新店站搭 923 至坪林站，可預約接駁（單程 NT$ 300）。</dd></div>
                        <div><dt>山上的事</dt><dd>手機訊號偏弱，Wi-Fi 只在茶室。夜裡溫度低，房內備有電毯。</dd></div>
                        <div><dt>取消</dt><dd>入住前 7 天可全額退款。颱風、豪雨等不可抗力，可免費改期。</dd></div>
                    </dl>
                </section>

                {/* 預約 */}
                <Reserve today={today} />
            </main>

            <footer className={styles.footer}>
                <p className={styles.footerLine}>霧散了，再來。</p>
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
                <h2 id="tea-title" className={styles.title}>一盞茶的時間。</h2>
                <p className={styles.lead}>
                    每間房都有一套茶席。選一款茶，照著水溫和秒數泡——第一泡短一點，之後每泡多等幾秒。這是阿公教我們的方法。
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
    const [copiedMessage, setCopiedMessage] = useState('');
    const [copyError, setCopyError] = useState(false);

    const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
    const t = terms[termPick];

    const message = t
        ? `您好，我想預約霧裡山房：\n・節氣：${t.name}（${md(t.start)}–${md(t.end)}）\n・房型：${room.term}｜${room.name}\n・${nights} 晚\n想請問這段期間的空房，謝謝！`
        : '';

    const copy = async () => {
        setCopyError(false);
        try {
            await navigator.clipboard.writeText(message);
            setCopiedMessage(message);
        } catch {
            setCopiedMessage('');
            setCopyError(true);
        }
    };

    return (
        <section id="reserve" className={styles.reserve} aria-labelledby="reserve-title">
            <div className={styles.reserveIntro} data-reveal>
                <p className={styles.kicker}><span>06</span> Reserve</p>
                <h2 id="reserve-title" className={styles.reserveTitle}>
                    挑一個節氣，<br />上山來。
                </h2>
                <p className={styles.lead}>
                    選好節氣、房間和天數，寫一封上山的邀請。這是虛構民宿的設計提案，可預覽並複製詢問訊息；不會傳送 LINE、查詢真實空房或建立預訂。節氣日期採近似值，實際交節可能相差一天。
                </p>
            </div>

            <div className={styles.reserveGrid} data-reveal>
                <div className={styles.reserveForm}>
                    <fieldset>
                        <legend>節氣</legend>
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
                        <legend>房間</legend>
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
                        <span id="nights-label">天數</span>
                        <div role="group" aria-labelledby="nights-label">
                            {[1, 2, 3].map((n) => (
                                <button key={n} type="button" aria-pressed={n === nights} onClick={() => setNights(n)}>
                                    {n} 晚
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className={styles.estimate}>
                        預估房價 <strong>{money(room.weekday * nights)}</strong> 起
                        <span>假日每晚 {money(room.weekend)}</span>
                    </p>
                </div>

                <div className={styles.chat} aria-label="LINE 訊息預覽">
                    <div className={styles.chatBar}>
                        <span className={styles.chatAvatar} aria-hidden="true">霧</span>
                        <span>霧裡山房</span>
                        <em>對話設計示意</em>
                    </div>
                    <div className={styles.chatBody}>
                        <p className={styles.bubbleMe}>{message || ' '}</p>
                        <p className={styles.bubbleThem}>
                            等你選好日子，我們再談一盞茶的時間。
                            <small>回覆情境示意・未連接民宿或空房系統</small>
                        </p>
                    </div>
                    <button type="button" className={styles.chatCopy} onClick={copy}>
                        {copiedMessage === message && message ? '已複製示範訊息' : '複製這段訊息'}
                    </button>
                    <p className={styles.copyStatus} role="status">{copyError ? '瀏覽器未允許複製，請選取上方訊息後手動複製。' : copiedMessage === message && message ? '訊息已複製；沒有送出預約。' : '僅產生訊息預覽，不會送出預約。'}</p>
                </div>
            </div>
        </section>
    );
}
