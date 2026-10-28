"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MobileExplore from '../MobileExplore';
import styles from './tide.module.css';

const photo = (id: string, w = 1800) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// 都蘭
const LAT = 22.876;
const LNG = 121.226;

// 半日潮模型（示意）：週期 12.42 小時，以一個參考滿潮時間推算
const TIDE_PERIOD = 12.42 * 3600 * 1000;
const TIDE_EPOCH = Date.UTC(2026, 0, 1, 2, 10);

function tideAt(t: number) {
    const phase = ((t - TIDE_EPOCH) / TIDE_PERIOD) * Math.PI * 2;
    const cycles = (t - TIDE_EPOCH) / TIDE_PERIOD;
    return {
        level: (Math.cos(phase) + 1) / 2,
        rising: Math.sin(phase) < 0,
        nextHigh: TIDE_EPOCH + Math.ceil(cycles) * TIDE_PERIOD,
        nextLow: TIDE_EPOCH + (Math.ceil(cycles - 0.5) + 0.5) * TIDE_PERIOD,
    };
}

// 日出日落（suncalc 演算法的精簡版）
function sunTimes(date: Date, lat: number, lng: number) {
    const rad = Math.PI / 180;
    const dayMs = 86400000;
    const J1970 = 2440588;
    const J2000 = 2451545;
    const J0 = 0.0009;
    const e = rad * 23.4397;
    const toDays = (d: Date) => d.valueOf() / dayMs - 0.5 + J1970 - J2000;
    const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * dayMs);

    const lw = rad * -lng;
    const phi = rad * lat;
    const n = Math.round(toDays(date) - J0 - lw / (2 * Math.PI));
    const ds = J0 + lw / (2 * Math.PI) + n;
    const M = rad * (357.5291 + 0.98560028 * ds);
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
    const L = M + C + rad * 102.9372 + Math.PI;
    const dec = Math.asin(Math.sin(e) * Math.sin(L));
    const transit = (x: number) => J2000 + x + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    const Jnoon = transit(ds);
    const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    const Jset = transit(J0 + (w + lw) / (2 * Math.PI) + n);
    return { sunrise: fromJulian(Jnoon - (Jset - Jnoon)), sunset: fromJulian(Jset) };
}

const clockFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});
const dateFmtTPE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' });
const hhmm = (t: Date | number) => clockFmt.format(t);

// 今天（台北時間）白天的乾潮：散步行程要排在白天
function daytimeLowTide(now: number) {
    const today = dateFmtTPE.format(now);
    const { nextLow } = tideAt(now);
    const lows = [-2, -1, 0, 1, 2]
        .map((k) => nextLow + k * TIDE_PERIOD)
        .filter((t) => dateFmtTPE.format(t) === today);
    const hour = (t: number) => Number(hhmm(t).slice(0, 2));
    return lows.find((t) => hour(t) >= 9 && hour(t) <= 16) ?? null;
}
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const MANIFESTO =
    '我們只有四間房。每一間都面向太平洋，窗外沒有別的建築，只有浪、礁岩，和每天準時換班的潮水。在這裡，時間不用時鐘計算——漲潮時起床，退潮時去散步，日落以後，把燈關小一點。';

type Room = {
    id: string;
    no: string;
    glyph: string;
    en: string;
    name: string;
    size: string;
    bed: string;
    guests: number;
    view: string;
    weekday: number;
    weekend: number;
    note: string;
    images: [string, string];
};

const ROOMS: Room[] = [
    {
        id: 'rising',
        no: '01',
        glyph: '漲',
        en: 'Rising',
        name: '雙人海景房',
        size: '9 坪',
        bed: 'Queen 雙人床',
        guests: 2,
        view: '正面海景・床尾看日出',
        weekday: 4800,
        weekend: 5800,
        note: '窗台做成可以坐下的深度。早上六點，陽光會先照到你的腳。',
        images: ['1617325247661-675ab4b64ae2', '1556020685-ae41abfc9365'],
    },
    {
        id: 'high',
        no: '02',
        glyph: '滿',
        en: 'High Water',
        name: '浴缸海景套房',
        size: '12 坪',
        bed: 'King 雙人床',
        guests: 2,
        view: '面海獨立浴缸',
        weekday: 6800,
        weekend: 7800,
        note: '浴缸對著海。滿潮時，浪聲會比水龍頭的聲音還近。',
        images: ['1620626011761-996317b8d101', '1600210492486-724fe5c67fb0'],
    },
    {
        id: 'ebb',
        no: '03',
        glyph: '退',
        en: 'Ebb',
        name: '四人家庭房',
        size: '15 坪',
        bed: '兩張 Queen 雙人床',
        guests: 4,
        view: '側海景・專屬小露台',
        weekday: 7600,
        weekend: 8800,
        note: '附一個水桶、兩支網子和一本潮間帶圖鑑，給想去礁岩探險的小孩。',
        images: ['1615874959474-d609969a20ed', '1505142468610-359e7d316be0'],
    },
    {
        id: 'slack',
        no: '04',
        glyph: '靜',
        en: 'Slack Water',
        name: '閣樓雙人房',
        size: '10 坪',
        bed: 'Queen 雙人床',
        guests: 2,
        view: '天窗・躺著看星星',
        weekday: 5600,
        weekend: 6600,
        note: '屋頂開了一扇天窗。平潮的夜裡最安靜，適合什麼都不做。',
        images: ['1618221195710-dd6b41faaea6', '1559827260-dc66d52bef19'],
    },
];

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const DAY = 86400000;

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function nightsBetween(a: number, b: number) {
    return Math.round((b - a) / DAY);
}

function priceFor(room: Room, checkIn: number, checkOut: number) {
    let total = 0;
    for (let t = checkIn; t < checkOut; t += DAY) {
        const dow = new Date(t).getDay();
        total += dow === 5 || dow === 6 ? room.weekend : room.weekday;
    }
    return total;
}

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

export default function TideSite() {
    const rootRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const manifestoRef = useRef<HTMLDivElement>(null);
    const dayRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const fullFonts = useFullFonts();
    const [now, setNow] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [openRoom, setOpenRoom] = useState<string | null>('rising');
    const [hoverRoom, setHoverRoom] = useState<string | null>(null);

    // 時鐘：每 30 秒更新
    useEffect(() => {
        setNow(Date.now());
        const id = window.setInterval(() => setNow(Date.now()), 30000);
        return () => window.clearInterval(id);
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
            { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
        );
        root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    // 捲動驅動：視差、逐字顯影、橫向釘選
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const wide = window.matchMedia('(min-width: 900px)');
        let raf = 0;

        const layout = () => {
            const day = dayRef.current;
            const track = trackRef.current;
            if (!day || !track) return;
            if (wide.matches && !reduce) {
                const dist = track.scrollWidth - window.innerWidth;
                day.style.height = `${dist + window.innerHeight}px`;
                day.dataset.pinned = 'true';
            } else {
                day.style.height = '';
                track.style.transform = '';
                delete day.dataset.pinned;
            }
        };

        const update = () => {
            raf = 0;
            const vh = window.innerHeight;
            const y = window.scrollY;
            setScrolled(y > vh * 0.6);

            if (!reduce) {
                heroRef.current?.style.setProperty('--hero-p', clamp(y / vh, 0, 1).toFixed(4));
            }

            const m = manifestoRef.current;
            if (m) {
                const r = m.getBoundingClientRect();
                // 文字頂端進入畫面 90% 處開始，文字中線到畫面 35% 處完成
                const p = reduce ? 1 : clamp((vh * 0.9 - r.top) / (vh * 0.55 + r.height / 2), 0, 1);
                m.style.setProperty('--p', p.toFixed(4));
            }

            const day = dayRef.current;
            const track = trackRef.current;
            if (day && track && day.dataset.pinned) {
                const r = day.getBoundingClientRect();
                const total = day.offsetHeight - vh;
                const p = clamp(-r.top / total, 0, 1);
                const dist = track.scrollWidth - window.innerWidth;
                track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
                day.style.setProperty('--p', p.toFixed(4));
            }
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        const onResize = () => {
            layout();
            onScroll();
        };

        layout();
        update();
        // 字型載入或內容變動會改變橫向軌道的寬度
        const ro = new ResizeObserver(onResize);
        if (trackRef.current) ro.observe(trackRef.current);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        wide.addEventListener('change', onResize);
        if (!reduce) document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            ro.disconnect();
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            wide.removeEventListener('change', onResize);
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    const tide = useMemo(() => (now ? tideAt(now) : null), [now]);
    const sun = useMemo(() => (now ? sunTimes(new Date(now), LAT, LNG) : null), [now]);

    const walkLow = useMemo(() => (now ? daytimeLowTide(now) : null), [now]);

    const day = [
        {
            time: sun ? hhmm(sun.sunrise) : '05:50',
            title: '日出',
            en: 'Sunrise',
            text: '拉開窗簾，太平洋就在床尾。東海岸的第一道光，會從綠島的方向上來。',
            img: '1476673160081-cf065607f449',
        },
        {
            time: '07:30',
            title: '早餐',
            en: 'Breakfast',
            text: '池上米、都蘭小農的放牧雞蛋、前一晚才上岸的鬼頭刀。菜單跟著漁獲每天換。',
            img: '1509042239860-f550ce710b93',
        },
        {
            time: walkLow ? hhmm(walkLow) : '10:00',
            title: walkLow ? '退潮散步' : '礁岩散步',
            en: 'Low Tide Walk',
            text: walkLow
                ? '讓一段海岸散步，成為這天最慢的時刻。圖中的時間取自潮位示意模型，實際出行須另查官方潮汐與天候。'
                : '把上午留給海岸步道，看浪打在黑色的石頭上。潮位曲線為設計示意，實際出行須另查官方潮汐與天候。',
            img: '1500375592092-40eb2168fd21',
            chart: true,
        },
        {
            time: '14:00',
            title: '午後',
            en: 'Afternoon',
            text: '沿著木棧道走到沙灘，或回房間睡個午覺。這段時間，我們建議什麼都不安排。',
            img: '1495954484750-af469f2f9be5',
        },
        {
            time: sun ? hhmm(sun.sunset) : '17:20',
            title: '粉紫色的海',
            en: 'Afterglow',
            text: '東海岸的夕陽落在山的那一邊。海面不會變紅，而是一整片慢慢暗下來的粉紫。',
            img: '1475924156734-496f6cac6ec1',
        },
        {
            time: '21:00',
            title: '關燈',
            en: 'Lights Out',
            text: '沒有光害的夜晚。浪聲是唯一的背景音樂，記得把窗戶留一條縫。',
            img: '1518837695005-2083093ee35b',
        },
    ].sort((a, b) => a.time.localeCompare(b.time));

    const tidePct = Math.round((tide?.level ?? 0.5) * 100);
    // 已展開的房間不需要再浮出預覽圖
    const activePreview = hoverRoom !== openRoom ? hoverRoom : null;

    const onRoomsPointerMove = (e: React.PointerEvent) => {
        const el = previewRef.current;
        if (!el || e.pointerType !== 'mouse') return;
        el.style.setProperty('--x', `${e.clientX}px`);
        el.style.setProperty('--y', `${e.clientY}px`);
    };

    const manifestoChars = useMemo(() => Array.from(MANIFESTO), []);

    return (
        <div ref={rootRef} className={styles.site} data-fonts={fullFonts ? 'full' : 'hero'}>
            <a href="#main" className={styles.skip}>跳到主要內容</a>
            <noscript>
                <style>{`.${styles.site}{--f-serif:'Tide Hero',var(--font-zh-serif),serif}.${styles.site} [data-reveal]{opacity:1;transform:none;clip-path:none}`}</style>
            </noscript>


            {/* 導覽列 */}
            <nav className={styles.nav} data-scrolled={scrolled ? 'true' : 'false'} aria-label="主選單">
                <a href="#top" className={styles.brand}>
                    <span className={styles.brandZh}>潮間</span>
                    <span className={styles.brandEn}>Between Tides</span>
                </a>
                <div className={styles.navTide} aria-live="off">
                    <span className={styles.navDot} data-rising={tide?.rising ? 'true' : 'false'} />
                    <span>都蘭 {now ? hhmm(now) : '--:--'}</span>
                    <span className={styles.navSep}>/</span>
                    <span>{tide ? (tide.rising ? '漲潮示意' : '退潮示意') : '潮位示意'}</span>
                </div>
                <div className={styles.navLinks}>
                    <SurfToggle level={tide?.level ?? 0.5} />
                    <a href="#rooms">房間</a>
                    <a href="#day">一日</a>
                    <a href="#visit">交通</a>
                    <MobileExplore links={[{ href: '#main', label: '關於潮間' }, { href: '#day', label: '海邊的一天' }, { href: '#rooms', label: '四種房間' }, { href: '#book', label: '住宿詢問預覽' }, { href: '#visit', label: '海岸位置' }]} />
                    <a href="#book" className={styles.navCta}>訂房</a>
                </div>
            </nav>

            {/* 首屏 */}
            <header id="top" ref={heroRef} className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src={photo('1473116763249-2faaef81ccda', 2400)}
                        alt="黃昏時的沙灘，海浪退回大海，天空是淡淡的粉橘色"
                        fill
                        preload
                        sizes="100vw"
                    />
                </div>
                <div className={styles.heroShade} />
                <p className={styles.concept}>01 / CONCEPT STAY<span>虛構民宿・互動設計提案</span></p>

                <h1 className={styles.heroTitle}>
                    <span className={styles.srOnly}>潮間 — 台東都蘭海邊民宿</span>
                    <span className={styles.heroLine} aria-hidden="true"><span>Between</span></span>
                    <span className={styles.heroLine} aria-hidden="true"><em>Tides</em></span>
                </h1>

                <p className={styles.heroVertical}>在潮汐之間，慢慢醒來</p>

                <dl className={styles.heroMeta}>
                    <div><dt>地點</dt><dd>台東 · 都蘭</dd></div>
                    <div><dt>座標</dt><dd>22°52′N 121°13′E</dd></div>
                    <div><dt>房間</dt><dd>四間，全部面海</dd></div>
                </dl>

                <a href="#main" className={styles.heroScroll}>
                    <span>Scroll</span>
                    <i aria-hidden="true" />
                </a>

                <TideWave level={tide?.level ?? 0.5} />
            </header>

            <main id="main">
                {/* 宣言：隨捲動逐字顯影 */}
                <section className={styles.manifesto} aria-labelledby="manifesto-title">
                    <p id="manifesto-title" className={styles.eyebrow}>
                        <span>No. 01</span> 關於潮間
                    </p>
                    <div
                        ref={manifestoRef}
                        className={styles.manifestoText}
                        style={{ '--n': manifestoChars.length } as React.CSSProperties}
                    >
                        {manifestoChars.map((c, i) => (
                            <span key={i} style={{ '--i': i } as React.CSSProperties}>{c}</span>
                        ))}
                    </div>

                    <div className={styles.tidePanel} data-reveal>
                        <div className={styles.tideGauge} aria-hidden="true">
                            <div
                                className={styles.tideGaugeFill}
                                style={{ height: `${tidePct}%`, '--w': `${tidePct}%` } as React.CSSProperties}
                            />
                        </div>
                        <div className={styles.tideReadout}>
                            <p className={styles.tideLabel}>此刻的潮位示意</p>
                            <p className={styles.tideBig}>
                                {tide ? `${Math.round(tide.level * 100)}%` : '—'}
                                <small>{tide ? (tide.rising ? '漲潮中 ↑' : '退潮中 ↓') : ''}</small>
                            </p>
                            <dl className={styles.tideList}>
                                <div><dt>下次滿潮</dt><dd>{tide ? hhmm(tide.nextHigh) : '--:--'}</dd></div>
                                <div><dt>下次乾潮</dt><dd>{tide ? hhmm(tide.nextLow) : '--:--'}</dd></div>
                                <div><dt>今日日出</dt><dd>{sun ? hhmm(sun.sunrise) : '--:--'}</dd></div>
                                <div><dt>今日日落</dt><dd>{sun ? hhmm(sun.sunset) : '--:--'}</dd></div>
                            </dl>
                            <p className={styles.tideNote}>潮位由週期模型產生，非實測或預報，不供海邊活動判斷；日出日落依都蘭座標估算。</p>
                        </div>
                    </div>
                </section>

                {/* 一日潮汐：橫向釘選捲動 */}
                <section id="day" ref={dayRef} className={styles.day} aria-labelledby="day-title">
                    <div className={styles.daySticky}>
                        <div ref={trackRef} className={styles.dayTrack}>
                            <div className={styles.dayHead}>
                                <p className={styles.eyebrow}><span>No. 02</span> 一日潮汐</p>
                                <h2 id="day-title" className={styles.dayTitle}>
                                    A day, <em>measured in tides.</em>
                                </h2>
                                <p className={styles.dayIntro}>
                                    想像在都蘭的一天，從日出到關燈。日出日落依日期估算，潮位與行程為設計示意。
                                </p>
                                <p className={styles.daySwipe} aria-hidden="true">左右滑動 →</p>
                            </div>
                            {day.map((d, i) => (
                                <article key={d.en} className={styles.dayCard}>
                                    <div className={styles.dayImg}>
                                        {'chart' in d && now ? (
                                            <TideChart now={now} walk={walkLow} />
                                        ) : (
                                            <Image src={photo(d.img, 1200)} alt="" fill sizes="(min-width: 900px) 34vw, 82vw" />
                                        )}
                                    </div>
                                    <div className={styles.dayBody}>
                                        <p className={styles.dayTime}>
                                            <span>{d.time}</span>
                                            <em>{String(i + 1).padStart(2, '0')} / {String(day.length).padStart(2, '0')}</em>
                                        </p>
                                        <h3>{d.title} <span>{d.en}</span></h3>
                                        <p>{d.text}</p>
                                    </div>
                                </article>
                            ))}
                            <div className={styles.dayEnd} aria-hidden="true">
                                <span>明天，</span>
                                <span>潮水會再來一次。</span>
                            </div>
                        </div>
                        <div className={styles.dayProgress} aria-hidden="true">
                            <span>{day[0].time}</span>
                            <i><b /></i>
                            <span>{day[day.length - 1].time}</span>
                        </div>
                    </div>
                </section>

                {/* 房間 */}
                <section id="rooms" className={styles.rooms} aria-labelledby="rooms-title">
                    <div className={styles.roomsHead} data-reveal>
                        <p className={styles.eyebrow}><span>No. 03</span> 房間</p>
                        <h2 id="rooms-title" className={styles.sectionTitle}>
                            四種潮汐，<br />四間房。
                        </h2>
                        <p className={styles.sectionLead}>
                            每間房以一種潮汐狀態命名。全部面海，全部只有一扇大窗——我們覺得一扇就夠了。
                        </p>
                    </div>

                    <ul
                        className={styles.roomList}
                        onPointerMove={onRoomsPointerMove}
                        onPointerLeave={() => setHoverRoom(null)}
                    >
                        {ROOMS.map((room) => {
                            const open = openRoom === room.id;
                            return (
                                <li key={room.id} className={styles.roomItem} data-open={open ? 'true' : 'false'} data-reveal>
                                    <button
                                        type="button"
                                        className={styles.roomRow}
                                        aria-expanded={open}
                                        aria-controls={`room-${room.id}`}
                                        onClick={() => setOpenRoom(open ? null : room.id)}
                                        onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverRoom(room.id)}
                                    >
                                        <span className={styles.roomNo}>{room.no}</span>
                                        <span className={styles.roomGlyph} aria-hidden="true">{room.glyph}</span>
                                        <span className={styles.roomNames}>
                                            <span className={styles.roomEn}>{room.en}</span>
                                            <span className={styles.roomZh}>{room.name}</span>
                                        </span>
                                        <span className={styles.roomFrom}>{money(room.weekday)} 起</span>
                                        <span className={styles.roomToggle} aria-hidden="true" />
                                    </button>
                                    <div
                                        id={`room-${room.id}`}
                                        className={styles.roomPanel}
                                        role="region"
                                        aria-label={`${room.name} 詳細資訊`}
                                        onPointerEnter={() => setHoverRoom(null)}
                                    >
                                        <div className={styles.roomPanelInner} inert={!open}>
                                            <div className={styles.roomGallery}>
                                                <div className={styles.roomShot}>
                                                    <Image src={photo(room.images[0], 1400)} alt={`${room.name}室內`} fill sizes="(min-width: 900px) 40vw, 92vw" />
                                                </div>
                                                <div className={styles.roomShot}>
                                                    <Image src={photo(room.images[1], 900)} alt={`${room.name}的窗景與細節`} fill sizes="(min-width: 900px) 22vw, 92vw" />
                                                </div>
                                            </div>
                                            <div className={styles.roomInfo}>
                                                <p className={styles.roomNote}>{room.note}</p>
                                                <dl className={styles.roomSpecs}>
                                                    <div><dt>坪數</dt><dd>{room.size}</dd></div>
                                                    <div><dt>床型</dt><dd>{room.bed}</dd></div>
                                                    <div><dt>入住</dt><dd>{room.guests} 人</dd></div>
                                                    <div><dt>景觀</dt><dd>{room.view}</dd></div>
                                                    <div><dt>平日</dt><dd>{money(room.weekday)}</dd></div>
                                                    <div><dt>週五、六</dt><dd>{money(room.weekend)}</dd></div>
                                                </dl>
                                                <a
                                                    href="#book"
                                                    className={styles.textLink}
                                                    onClick={() => window.dispatchEvent(new CustomEvent('tide:pick-room', { detail: room.id }))}
                                                >
                                                    選擇這間房型 <span aria-hidden="true">→</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div ref={previewRef} className={styles.roomPreview} data-active={activePreview ? 'true' : 'false'} aria-hidden="true">
                        {ROOMS.map((room) => (
                            <div key={room.id} className={styles.roomPreviewImg} data-on={activePreview === room.id ? 'true' : 'false'}>
                                <Image src={photo(room.images[0], 700)} alt="" fill sizes="22vw" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 餐桌 */}
                <section className={styles.table} aria-labelledby="table-title">
                    <div className={styles.tableImg} data-reveal>
                        <Image src={photo('1533089860892-a7c6f0a88666', 1600)} alt="木桌上的早餐：煎蛋吐司與番茄" fill sizes="(min-width: 900px) 50vw, 100vw" />
                    </div>
                    <div className={styles.tableText} data-reveal>
                        <p className={styles.eyebrow}><span>No. 04</span> 餐桌</p>
                        <h2 id="table-title" className={styles.sectionTitle}>早餐的菜單，<br />由昨晚的海決定。</h2>
                        <p className={styles.sectionLead}>
                            我們跟新港漁港的兩艘船買魚，跟都蘭部落的阿姨買野菜。天氣不好、船沒出海的日子，就是地瓜粥配醬菜——那也是很好的一天。
                        </p>
                        <ul className={styles.tableList}>
                            <li><span>主食</span>池上米、都蘭小米麻糬</li>
                            <li><span>海味</span>鬼頭刀、旗魚，依漁獲</li>
                            <li><span>蔬果</span>部落野菜、東河鳳梨、釋迦</li>
                            <li><span>咖啡</span>手沖，豆子來自太麻里</li>
                        </ul>
                    </div>
                </section>

                {/* 數字 */}
                <section className={styles.numbers} aria-label="潮間的幾個數字">
                    <Counter value={4} label="間房，全部面海" />
                    <Counter value={38} label="步，從房門走到浪花" />
                    <Counter value={312} label="個早晨，一年中看得見日出" />
                    <Counter value={0} label="台電視。真的，一台都沒有" />
                </section>

                {/* 訂房 */}
                <Booking />

                {/* 交通 */}
                <section id="visit" className={styles.visit} aria-labelledby="visit-title">
                    <div className={styles.visitText} data-reveal>
                        <p className={styles.eyebrow}><span>No. 06</span> 交通</p>
                        <h2 id="visit-title" className={styles.sectionTitle}>台 11 線，<br />145 公里處。</h2>
                        <p className={styles.sectionLead}>
                            從台東市區沿著台 11 線往北，海一直在右手邊。看到都蘭糖廠以後再開三分鐘，那棟白色的房子就是了。
                        </p>
                        <ol className={styles.routeList}>
                            <li><span>都蘭糖廠</span><em>車程 3 分鐘</em></li>
                            <li><span>加路蘭海岸</span><em>車程 15 分鐘</em></li>
                            <li><span>台東市區 / 台東車站</span><em>車程 30 分鐘</em></li>
                            <li><span>台東豐年機場</span><em>車程 35 分鐘</em></li>
                            <li><span>三仙台</span><em>車程 50 分鐘</em></li>
                        </ol>
                        <p className={styles.visitPs}>需要接駁？台東車站與機場皆可預約，單程 NT$ 800。</p>
                    </div>
                    <CoastMap />
                </section>
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <a href="#book" className={styles.footerCta}>
                        <span>Come for the tide,</span>
                        <em>stay for the quiet.</em>
                    </a>
                </div>
                <div className={styles.footerGrid}>
                    <div>
                        <p className={styles.footerLabel}>地址</p>
                        <p>台東縣東河鄉都蘭村<br />（示範地址）</p>
                    </div>
                    <div>
                        <p className={styles.footerLabel}>聯絡</p>
                        <p>概念設計・未提供聯絡帳號<br />此頁不接受實際預訂</p>
                    </div>
                    <div>
                        <p className={styles.footerLabel}>入住 / 退房</p>
                        <p>15:00 後 / 11:00 前<br />全館禁菸・可帶毛小孩</p>
                    </div>
                    <div>
                        <p className={styles.footerLabel}>登記</p>
                        <p>虛構品牌・非營業旅宿<br />影像為情境素材，非實景</p>
                    </div>
                </div>
                <div className={styles.footerWord} data-word="潮間" aria-hidden="true" />
                <div className={styles.footerBottom}>
                    <span>© 潮間 Between Tides</span>
                    <Link href="/#portfolio">Website by 智遊工作室 — Concept work</Link>
                </div>
            </footer>

            <Link href="/#portfolio" className={styles.studioBadge}>
                <span aria-hidden="true">←</span> 智遊工作室・概念民宿
            </Link>
        </div>
    );
}

// 浪聲：在瀏覽器裡即時合成（布朗噪音＋兩個不同週期的起伏），不需要音檔。
// 潮位越高，浪聲越近、越亮。
type Surf = { ctx: AudioContext; master: GainNode; filter: BiquadFilterNode };

function createSurf(): Surf {
    const ctx = new AudioContext();
    const len = ctx.sampleRate * 6;
    const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < len; i++) {
            last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
            data[i] = last * 3.2;
        }
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.4;

    const swell = ctx.createGain();
    swell.gain.value = 0.5;
    // 兩個週期不整除的起伏疊在一起，浪才不會像節拍器
    [[1 / 7.3, 0.28], [1 / 11.9, 0.18]].forEach(([freq, depth]) => {
        const lfo = ctx.createOscillator();
        const amount = ctx.createGain();
        lfo.frequency.value = freq;
        amount.gain.value = depth;
        lfo.connect(amount).connect(swell.gain);
        lfo.start();
    });
    const wash = ctx.createOscillator();
    const washAmount = ctx.createGain();
    wash.frequency.value = 1 / 7.3;
    washAmount.gain.value = 260;
    wash.connect(washAmount).connect(filter.frequency);
    wash.start();

    const master = ctx.createGain();
    master.gain.value = 0;
    src.connect(filter).connect(swell).connect(master).connect(ctx.destination);
    src.start();
    return { ctx, master, filter };
}

function SurfToggle({ level }: { level: number }) {
    const surf = useRef<Surf | null>(null);
    const [on, setOn] = useState(false);

    useEffect(() => {
        const s = surf.current;
        if (!s) return;
        s.filter.frequency.setTargetAtTime(520 + level * 620, s.ctx.currentTime, 1.5);
        if (on) s.master.gain.setTargetAtTime(0.22 + level * 0.28, s.ctx.currentTime, 1.2);
    }, [level, on]);

    useEffect(() => () => {
        surf.current?.ctx.close();
    }, []);

    const toggle = () => {
        if (!surf.current) surf.current = createSurf();
        const s = surf.current;
        const next = !on;
        if (next) {
            s.ctx.resume();
            s.filter.frequency.value = 520 + level * 620;
            s.master.gain.setTargetAtTime(0.22 + level * 0.28, s.ctx.currentTime, 1.2);
        } else {
            s.master.gain.setTargetAtTime(0, s.ctx.currentTime, 0.4);
        }
        setOn(next);
    };

    return (
        <button
            type="button"
            className={styles.surf}
            aria-pressed={on}
            onClick={toggle}
            title={on ? '關掉浪聲' : '打開浪聲（音量跟著此刻潮位）'}
        >
            <span className={styles.surfBars} aria-hidden="true"><i /><i /><i /><i /></span>
            <span className={styles.surfLabel}>浪聲</span>
        </button>
    );
}

// 今天（台北時間）00:00–24:00 的潮位曲線，取代一張素材照片：每天都不一樣的原創圖
function TideChart({ now, walk }: { now: number; walk: number | null }) {
    const W = 400;
    const H = 500;
    const top = 150;
    const bottom = 400;
    const day0 = Date.parse(`${dateFmtTPE.format(now)}T00:00:00+08:00`);
    const x = (t: number) => ((t - day0) / DAY) * W;
    const y = (level: number) => bottom - level * (bottom - top);

    const pts: string[] = [];
    for (let i = 0; i <= 96; i++) {
        const t = day0 + (i / 96) * DAY;
        pts.push(`${x(t).toFixed(1)},${y(tideAt(t).level).toFixed(1)}`);
    }
    const line = `M${pts.join(' L')}`;

    // 今天的滿潮與乾潮
    const marks: { t: number; high: boolean }[] = [];
    const first = tideAt(day0);
    for (let k = -1; k < 3; k++) {
        const hi = first.nextHigh + k * TIDE_PERIOD;
        const lo = first.nextLow + k * TIDE_PERIOD;
        if (hi >= day0 && hi < day0 + DAY) marks.push({ t: hi, high: true });
        if (lo >= day0 && lo < day0 + DAY) marks.push({ t: lo, high: false });
    }
    const nowLevel = tideAt(now).level;

    return (
        <svg className={styles.tideChart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="週期模型的潮位示意曲線">
            <text x="24" y="48" className={styles.chartTitle}>Today&apos;s tide</text>
            <text x="24" y="76" className={styles.chartSub}>都蘭・{dateFmtTPE.format(now)}</text>
            {[0, 6, 12, 18, 24].map((h) => (
                <g key={h}>
                    <line x1={(h / 24) * W} x2={(h / 24) * W} y1={top - 20} y2={bottom + 44} className={styles.chartGrid} />
                    <text x={Math.min(W - 18, Math.max(4, (h / 24) * W + 4))} y={bottom + 64} className={styles.chartAxis}>
                        {String(h).padStart(2, '0')}
                    </text>
                </g>
            ))}
            <path d={`${line} L${W},${H} L0,${H} Z`} className={styles.chartArea} />
            <path d={line} className={styles.chartLine} />
            {marks.map((m) => (
                <g key={m.t}>
                    <circle cx={x(m.t)} cy={y(m.high ? 1 : 0)} r="3" className={styles.chartMark} />
                    <text x={x(m.t)} y={y(m.high ? 1 : 0) + (m.high ? -14 : 24)} textAnchor="middle" className={styles.chartLabel}>
                        {m.high ? '滿' : '乾'} {hhmm(m.t)}
                    </text>
                </g>
            ))}
            {walk !== null && <circle cx={x(walk)} cy={y(0)} r="9" className={styles.chartWalk} />}
            <circle cx={x(now)} cy={y(nowLevel)} r="5" className={styles.chartNow} />
            <text x={x(now)} y={y(nowLevel) - 16} textAnchor="middle" className={styles.chartNowLabel}>
                現在
            </text>
        </svg>
    );
}

function TideWave({ level }: { level: number }) {
    // 兩層波浪，潮位越高，浪線越往上
    const wave = (amp: number, len: number, base: number) => {
        let d = `M0 ${base}`;
        for (let x = 0; x < 2400; x += len) {
            d += ` Q${x + len / 4} ${base - amp} ${x + len / 2} ${base} T${x + len} ${base}`;
        }
        return `${d} V200 H0 Z`;
    };
    return (
        <div className={styles.wave} style={{ '--tide': level.toFixed(3) } as React.CSSProperties} aria-hidden="true">
            <svg className={styles.waveBack} viewBox="0 0 2400 200" preserveAspectRatio="none">
                <path d={wave(14, 400, 80)} />
            </svg>
            <svg className={styles.waveFront} viewBox="0 0 2400 200" preserveAspectRatio="none">
                <path d={wave(10, 600, 96)} />
            </svg>
        </div>
    );
}

function Counter({ value, label }: { value: number; label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            if (reduce || value === 0) {
                setShown(value);
                return;
            }
            const start = performance.now();
            const dur = 1600;
            const tick = (t: number) => {
                const k = clamp((t - start) / dur, 0, 1);
                setShown(Math.round(value * (1 - Math.pow(1 - k, 4))));
                if (k < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        }, { threshold: 0.6 });
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [value]);

    return (
        <div ref={ref} className={styles.counter}>
            <span className={styles.counterValue}>{shown}</span>
            <span className={styles.counterLabel}>{label}</span>
        </div>
    );
}

function Booking() {
    const [today, setToday] = useState<number | null>(null);
    const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
    const [roomId, setRoomId] = useState(ROOMS[0].id);
    const [checkIn, setCheckIn] = useState<number | null>(null);
    const [checkOut, setCheckOut] = useState<number | null>(null);
    const [guests, setGuests] = useState(2);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const d = new Date();
        setToday(startOfDay(d));
        setMonth({ y: d.getFullYear(), m: d.getMonth() });
        const onPick = (e: Event) => {
            const id = (e as CustomEvent<string>).detail;
            if (ROOMS.some((r) => r.id === id)) setRoomId(id);
        };
        window.addEventListener('tide:pick-room', onPick);
        return () => window.removeEventListener('tide:pick-room', onPick);
    }, []);

    const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];

    useEffect(() => {
        setGuests((g) => Math.min(g, room.guests));
    }, [room.guests]);

    // 桌機並排兩個月，手機只顯示第一個
    const months = useMemo(() => {
        if (!month) return [];
        return [0, 1].map((k) => {
            const first = new Date(month.y, month.m + k, 1);
            const y = first.getFullYear();
            const m = first.getMonth();
            const count = new Date(y, m + 1, 0).getDate();
            const cells: (number | null)[] = Array(first.getDay()).fill(null);
            for (let d = 1; d <= count; d++) cells.push(new Date(y, m, d).getTime());
            return { key: `${y}-${m}`, label: `${y} 年 ${m + 1} 月`, cells };
        });
    }, [month]);

    const pick = (t: number) => {
        setSent(false);
        if (checkIn === null || checkOut !== null || t <= checkIn) {
            setCheckIn(t);
            setCheckOut(null);
        } else {
            setCheckOut(t);
        }
    };

    const shiftMonth = (delta: number) => {
        if (!month) return;
        const d = new Date(month.y, month.m + delta, 1);
        setMonth({ y: d.getFullYear(), m: d.getMonth() });
    };

    const nights = checkIn !== null && checkOut !== null ? nightsBetween(checkIn, checkOut) : 0;
    const total = nights ? priceFor(room, checkIn!, checkOut!) : 0;
    const dateFmt = (t: number) => {
        const d = new Date(t);
        return `${d.getMonth() + 1}/${d.getDate()}（${WEEKDAYS[d.getDay()]}）`;
    };
    const canPrev = month && today !== null && (month.y > new Date(today).getFullYear() || month.m > new Date(today).getMonth());

    return (
        <section id="book" className={styles.book} aria-labelledby="book-title">
            <div className={styles.bookHead} data-reveal>
                <p className={styles.eyebrow}><span>No. 05</span> 訂房</p>
                <h2 id="book-title" className={styles.sectionTitle}>挑一段潮汐，<br />想像你的停留。</h2>
                <p className={styles.sectionLead}>試選日期與房型，預覽一份住宿詢問。這是虛構民宿的設計提案，房價、空房與服務皆為示意，不會送出訂單或保留房間。</p>
            </div>

            <div className={styles.bookGrid} data-reveal>
                <div className={styles.calendar}>
                    <div className={styles.calNav}>
                        <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="上個月">←</button>
                        <button type="button" onClick={() => shiftMonth(1)} aria-label="下個月">→</button>
                    </div>
                    <div className={styles.calMonths}>
                        {months.map((mo) => (
                            <div key={mo.key} className={styles.calMonth}>
                                <p className={styles.calLabel} aria-live="polite">{mo.label}</p>
                                <div className={styles.calGrid} role="group" aria-label={`${mo.label}，選擇入住與退房日期`}>
                                    {WEEKDAYS.map((w) => (
                                        <span key={w} className={styles.calDow} aria-hidden="true">{w}</span>
                                    ))}
                                    {mo.cells.map((t, i) => {
                                        if (t === null) return <span key={`b${i}`} />;
                                        const d = new Date(t);
                                        const past = today !== null && t < today;
                                        const isIn = t === checkIn;
                                        const isOut = t === checkOut;
                                        const between = checkIn !== null && checkOut !== null && t > checkIn && t < checkOut;
                                        const weekend = d.getDay() === 5 || d.getDay() === 6;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                className={styles.calDay}
                                                disabled={past}
                                                onClick={() => pick(t)}
                                                data-state={isIn ? 'in' : isOut ? 'out' : between ? 'between' : undefined}
                                                data-weekend={weekend ? 'true' : undefined}
                                                aria-pressed={isIn || isOut}
                                                aria-label={`${d.getMonth() + 1} 月 ${d.getDate()} 日${isIn ? '，入住' : ''}${isOut ? '，退房' : ''}`}
                                            >
                                                {d.getDate()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className={styles.calHint}>
                        {checkIn === null ? '先選入住日' : checkOut === null ? '再選退房日' : `共 ${nights} 晚`}
                        <span>・ 週五、六夜為假日價</span>
                    </p>
                </div>

                <form
                    className={styles.bookForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (nights) setSent(true);
                    }}
                >
                    <fieldset className={styles.roomPick}>
                        <legend>房型</legend>
                        {ROOMS.map((r) => (
                            <label key={r.id} data-checked={r.id === roomId ? 'true' : 'false'}>
                                <input
                                    type="radio"
                                    name="room"
                                    value={r.id}
                                    checked={r.id === roomId}
                                    onChange={() => { setRoomId(r.id); setSent(false); }}
                                />
                                <span className={styles.roomPickGlyph} aria-hidden="true">{r.glyph}</span>
                                <span>{r.name}<em>{r.guests} 人・{money(r.weekday)} 起</em></span>
                            </label>
                        ))}
                    </fieldset>

                    <div className={styles.guests}>
                        <span id="guests-label">人數</span>
                        <div className={styles.stepper} role="group" aria-labelledby="guests-label">
                            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="減少一人">−</button>
                            <output aria-live="polite">{guests}</output>
                            <button type="button" onClick={() => setGuests((g) => Math.min(room.guests, g + 1))} disabled={guests >= room.guests} aria-label="增加一人">+</button>
                        </div>
                    </div>

                    <dl className={styles.summary}>
                        <div><dt>入住</dt><dd>{checkIn !== null ? dateFmt(checkIn) : '—'}</dd></div>
                        <div><dt>退房</dt><dd>{checkOut !== null ? dateFmt(checkOut) : '—'}</dd></div>
                        <div className={styles.summaryTotal}><dt>{nights ? `${nights} 晚合計` : '合計'}</dt><dd>{nights ? money(total) : '—'}</dd></div>
                    </dl>

                    <button type="submit" className={styles.bookSubmit} disabled={!nights}>
                        {nights ? '預覽住宿詢問' : '請先選擇日期'}
                    </button>

                    <p className={styles.bookStatus} role="status">
                        {sent
                            ? `詢問預覽：${room.name}，${dateFmt(checkIn!)} 入住、${nights} 晚、${guests} 位。此訊息尚未傳送，沒有建立預訂。`
                            : '示範房價僅供試算，不代表實際報價或可訂空房。'}
                    </p>
                </form>
            </div>
        </section>
    );
}

function CoastMap() {
    return (
        <figure className={styles.map} data-reveal>
            <svg viewBox="0 0 400 560" role="img" aria-labelledby="map-title">
                <title id="map-title">台東海岸示意圖：都蘭位於台東市以北約 25 公里的台 11 線上</title>
                <defs>
                    <pattern id="sea-lines" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
                        <line x1="0" y1="6" x2="12" y2="6" className={styles.mapHatch} />
                    </pattern>
                </defs>
                <path className={styles.mapSea} d="M262 0 C250 70 270 120 250 180 C232 236 240 280 214 330 C192 372 180 420 150 470 C130 505 110 530 96 560 L400 560 L400 0 Z" />
                <path className={styles.mapSeaHatch} d="M262 0 C250 70 270 120 250 180 C232 236 240 280 214 330 C192 372 180 420 150 470 C130 505 110 530 96 560 L400 560 L400 0 Z" fill="url(#sea-lines)" />
                <path className={styles.mapCoast} d="M262 0 C250 70 270 120 250 180 C232 236 240 280 214 330 C192 372 180 420 150 470 C130 505 110 530 96 560" />
                <path className={styles.mapRoad} d="M244 0 C234 70 252 122 234 180 C218 232 224 280 200 326 C178 368 166 418 136 466 C118 498 98 526 84 560" />
                <text x="300" y="300" className={styles.mapOcean}>太平洋</text>
                <text x="128" y="128" className={styles.mapRange}>海岸山脈</text>

                <g className={styles.mapPin}><circle cx="258" cy="70" r="3.5" /><text x="244" y="74" textAnchor="end">三仙台</text></g>
                <g className={styles.mapPin}><circle cx="226" cy="300" r="3.5" /><text x="212" y="304" textAnchor="end">都蘭糖廠</text></g>
                <g className={styles.mapPinHome}>
                    <circle cx="232" cy="282" r="14" className={styles.mapPulse} />
                    <circle cx="232" cy="282" r="5" />
                    <text x="248" y="278">潮間</text>
                    <text x="248" y="294" className={styles.mapSmall}>Between Tides</text>
                </g>
                <g className={styles.mapPin}><circle cx="170" cy="438" r="3.5" /><text x="184" y="442">加路蘭</text></g>
                <g className={styles.mapPin}><circle cx="114" cy="528" r="3.5" /><text x="100" y="532" textAnchor="end">台東市</text></g>
                <text x="40" y="40" className={styles.mapNorth}>N ↑</text>
            </svg>
            <figcaption>示意圖，非實際比例</figcaption>
        </figure>
    );
}
