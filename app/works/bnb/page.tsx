"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './bnb.module.css';

export default function BNBPage() {
    const [loading, setLoading] = useState(true);
    const [navActive, setNavActive] = useState(false);
    const [activeRoom, setActiveRoom] = useState('double');
    const [showTop, setShowTop] = useState(false);

    // Refs for scroll animations
    const revealRefs = useRef<(HTMLElement | null)[]>([]);

    // Add ref to array
    const addToRefs = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        // Preloader
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        // Scroll Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        revealRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        // Scroll Handler for Go Top
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowTop(true);
            } else {
                setShowTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id: string) => {
        setNavActive(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.wrapper}>
            {/* Preloader */}
            <div className={`${styles.preloader} ${!loading ? styles.hidden : ''}`}>
                <div className={styles.preloaderContent}>
                    <div className={styles.preloaderKanji}>玩 宜 蘭</div>
                </div>
            </div>

            {/* Navigation Toggle */}
            <button
                className={`${styles.navToggle} ${navActive ? styles.active : ''}`}
                onClick={() => setNavActive(!navActive)}
                aria-label="Menu"
            >
                <span></span><span></span><span></span>
                <div className={styles.navLabel}>MENU</div>
            </button>

            {/* Navigation Overlay */}
            <nav className={`${styles.navOverlay} ${navActive ? styles.active : ''}`}>
                <div className={styles.navMenu}>
                    <div className={styles.navLogoArea}>
                        <div className={styles.kanji}>玩宜蘭</div>
                        <div className={styles.en}>Hinoki Forest Guesthouse</div>
                    </div>
                    <a onClick={() => scrollToSection('about')} href="#about">關於我們 <span className={styles.enSub}>About Us</span></a>
                    <a onClick={() => scrollToSection('rooms')} href="#rooms">客房介紹 <span className={styles.enSub}>Guest Room</span></a>
                    <a onClick={() => scrollToSection('notice')} href="#notice">訂房須知 <span className={styles.enSub}>Notice</span></a>
                    <a onClick={() => scrollToSection('location')} href="#location">交通位置 <span className={styles.enSub}>Location</span></a>
                    <a onClick={() => scrollToSection('spots')} href="#spots">鄰近景點 <span className={styles.enSub}>Scenic Spots</span></a>
                    <a onClick={() => scrollToSection('contact')} href="#contact">聯絡我們 <span className={styles.enSub}>Contact Us</span></a>
                    <Link href="/" className="mt-8 block text-white opacity-50 hover:opacity-100">← 返回首頁 (Back to Portfolio)</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero} id="home">
                <div className={styles.heroLeft}>
                    <div className={styles.heroLogo}>
                        <div className={styles.mainKanji}>玩宜蘭</div>
                        <div className={styles.subText}>
                            <span className={styles.jpStyle}>日式民宿</span>
                            <span className={styles.dot}></span>
                            <span className={styles.enName}>Hinoki Forest Guesthouse</span>
                        </div>
                    </div>
                    <div className={styles.heroContact}>
                        <p>電話 | TEL 0912-345-678</p>
                        <p>LINE ID @hinokiforest</p>
                        <p>E-mail info@hinokiforest.com</p>
                        <p>地址 | ADD 宜蘭縣XX鄉XX路XX號</p>
                    </div>
                    <div className={styles.scrollHint}>
                        <div>
                            <div className={styles.text} style={{ fontStyle: 'italic' }}>Enjoy your Life</div>
                            <p style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-light)',
                                marginTop: '0.3rem',
                                fontFamily: "'Cormorant Garamond', serif",
                                lineHeight: 1.6
                            }}>
                                Surrounded by cypress and forest,<br />
                                find your peace in Yilan.
                            </p>
                        </div>
                        <div className={styles.line}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div className={styles.scrollLabel}>SCROLL</div>
                            <div className={styles.scrollLineV} style={{ margin: '0.5rem auto 0' }}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.heroRight}>
                    <img src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=900&h=1200&fit=crop" alt="玩宜蘭民宿外觀" />
                </div>
            </section>

            {/* Quote */}
            <section className={`${styles.quoteSection} ${styles.reveal}`} ref={addToRefs}>
                <div className={styles.quoteText}>
                    Surrounded by cypress and forest,<br />
                    find your peace in Yilan.<br />
                    A place where time slows down,<br />
                    and nature whispers softly.
                </div>
                <div className={styles.quoteLine}></div>
                <div className={styles.quoteLabel}>SCROLL</div>
            </section>

            {/* About Section */}
            <section className={styles.aboutSection} id="about">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>關於我們</div>
                    <div className={styles.en}>About Us</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>
                <div className={`${styles.aboutContent} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.aboutImg}>
                        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop" alt="民宿內部" />
                    </div>
                    <div className={styles.aboutText}>
                        <h3>檜木香氣中的寧靜時光</h3>
                        <p>玩宜蘭民宿座落於宜蘭美麗的田園風光之中，以台灣珍貴的檜木為設計主軸，融合日式美學與現代舒適，打造出一處遠離城市喧囂的療癒空間。</p>
                        <p>每一間客房都瀰漫著淡淡的檜木清香，搭配精心挑選的日式家具與暖色調燈光，讓您在旅途中找到如家般的溫暖與自在。</p>
                        <p>在這裡，您可以聆聽蟲鳴鳥叫、欣賞田園風景、品味在地美食，感受宜蘭最純粹的生活節奏。</p>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section className={styles.roomsSection} id="rooms">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>客房介紹</div>
                    <div className={styles.en}>Guest Rooms</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>

                <div className={`${styles.roomTabs} ${styles.reveal}`} ref={addToRefs}>
                    {[
                        { id: 'double', zh: '雙人套房', en: 'Double Room' },
                        { id: 'japanese', zh: '日式四人房', en: 'Japanese Quad' },
                        { id: 'quad', zh: '四人套房', en: 'Quad Room' },
                        { id: 'family', zh: '親子套房', en: 'Family Room' },
                    ].map(room => (
                        <button
                            key={room.id}
                            className={`${styles.roomTab} ${activeRoom === room.id ? styles.active : ''}`}
                            onClick={() => setActiveRoom(room.id)}
                        >
                            <span className={styles.zh}>{room.zh}</span>
                            <span className={styles.en}>{room.en}</span>
                        </button>
                    ))}
                </div>

                {/* Room Card: Double */}
                <div className={`${styles.roomCard} ${activeRoom === 'double' ? styles.visible : ''}`} style={{ display: activeRoom === 'double' ? 'block' : 'none' }}>
                    <div className={styles.roomCardHeader}>
                        <h3>｜ 玩宜蘭 雙人套房 ｜</h3>
                        <button className={styles.roomPriceBtn}>房價</button>
                    </div>
                    <div className={styles.roomCardTagline}>
                        ✽ GUEST ROOM ✽ &nbsp; Being in the same room with people and creating something together is a good thing.
                    </div>
                    <div className={styles.roomGallery}>
                        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop" alt="雙人房1" />
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop" alt="雙人房2" />
                    </div>
                    <div className={styles.roomDetails}>
                        <RoomDetail icon="size" text="坪數：約 8 坪" />
                        <RoomDetail icon="bed" text="床型：標準雙人床" />
                        <RoomDetail icon="people" text="入住人數：2 人" />
                        <RoomDetail icon="amenities" text="設備：冷暖氣、液晶電視、免治馬桶、盥洗用品" />
                    </div>
                </div>

                {/* Room Card: Japanese Quad */}
                <div className={`${styles.roomCard} ${activeRoom === 'japanese' ? styles.visible : ''}`} style={{ display: activeRoom === 'japanese' ? 'block' : 'none' }}>
                    <div className={styles.roomCardHeader}>
                        <h3>｜ 玩宜蘭 日式四人房 ｜</h3>
                        <button className={styles.roomPriceBtn}>房價</button>
                    </div>
                    <div className={styles.roomCardTagline}>
                        ✽ GUEST ROOM ✽ &nbsp; Experience the authentic Japanese tatami lifestyle.
                    </div>
                    <div className={styles.roomGallery}>
                        <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop" alt="日式四人房1" />
                        <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop" alt="日式四人房2" />
                    </div>
                    <div className={styles.roomDetails}>
                        <RoomDetail icon="size" text="坪數：約 12 坪" />
                        <RoomDetail icon="bed" text="床型：日式榻榻米舖床" />
                        <RoomDetail icon="people" text="入住人數：2～4 人" />
                        <RoomDetail icon="amenities" text="設備：冷暖氣、液晶電視、免治馬桶、檜木浴缸" />
                    </div>
                </div>

                {/* Room Card: Quad */}
                <div className={`${styles.roomCard} ${activeRoom === 'quad' ? styles.visible : ''}`} style={{ display: activeRoom === 'quad' ? 'block' : 'none' }}>
                    <div className={styles.roomCardHeader}>
                        <h3>｜ 玩宜蘭 四人套房 ｜</h3>
                        <button className={styles.roomPriceBtn}>房價</button>
                    </div>
                    <div className={styles.roomCardTagline}>
                        ✽ GUEST ROOM ✽ &nbsp; A spacious retreat for friends and family.
                    </div>
                    <div className={styles.roomGallery}>
                        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop" alt="四人套房1" />
                        <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop" alt="四人套房2" />
                    </div>
                    <div className={styles.roomDetails}>
                        <RoomDetail icon="size" text="坪數：約 14 坪" />
                        <RoomDetail icon="bed" text="床型：兩張標準雙人床" />
                        <RoomDetail icon="people" text="入住人數：2～4 人" />
                        <RoomDetail icon="amenities" text="設備：冷暖氣、液晶電視、免治馬桶、乾濕分離衛浴" />
                    </div>
                </div>

                {/* Room Card: Family */}
                <div className={`${styles.roomCard} ${activeRoom === 'family' ? styles.visible : ''}`} style={{ display: activeRoom === 'family' ? 'block' : 'none' }}>
                    <div className={styles.roomCardHeader}>
                        <h3>｜ 玩宜蘭 親子套房 ｜</h3>
                        <button className={styles.roomPriceBtn}>房價</button>
                    </div>
                    <div className={styles.roomCardTagline}>
                        ✽ GUEST ROOM ✽ &nbsp; Create unforgettable memories with your loved ones.
                    </div>
                    <div className={styles.roomGallery}>
                        <img src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&h=400&fit=crop" alt="親子套房1" />
                        <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop" alt="親子套房2" />
                    </div>
                    <div className={styles.roomDetails}>
                        <RoomDetail icon="size" text="坪數：約 16 坪" />
                        <RoomDetail icon="bed" text="床型：雙人床 + 兒童遊戲區" />
                        <RoomDetail icon="people" text="入住人數：2 大 2 小" />
                        <RoomDetail icon="amenities" text="設備：冷暖氣、液晶電視、免治馬桶、兒童玩具、繪本" />
                    </div>
                </div>

            </section>

            {/* Notice Section */}
            <section className={styles.noticeSection} id="notice">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>訂房須知</div>
                    <div className={styles.en}>Notice</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>
                <div className={styles.noticeContent}>
                    <div className={`${styles.noticeGrid} ${styles.reveal}`} ref={addToRefs}>
                        <NoticeItem title="入住 / 退房時間" text={<>入住時間：下午 3:00 後<br />退房時間：上午 11:00 前<br />如需提早入住或延後退房，請事先與我們聯繫。</>} />
                        <NoticeItem title="訂金與取消" text={<>訂房需支付房價 50% 作為訂金。<br />入住前 7 天取消可全額退款。<br />入住前 3-6 天取消退還 50%。<br />入住前 2 天內取消恕不退款。</>} />
                        <NoticeItem title="加人費用" text={<>每房加人每晚 NT$500（含備品及早餐）。<br />6 歲以下兒童免費入住（不佔床）。<br />嬰兒床可免費提供，請預先告知。</>} />
                        <NoticeItem title="其他注意事項" text={<>全館禁止吸菸。<br />寵物恕不接受入住。<br />請愛護民宿設施與環境。<br />附設免費停車場。</>} />
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className={styles.locationSection} id="location">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>交通位置</div>
                    <div className={styles.en}>Location</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>
                <div className={styles.locationContent}>
                    <div className={`${styles.locationGrid} ${styles.reveal}`} ref={addToRefs}>
                        <div className={styles.locationMap}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57928.56488866!2d121.72!3d24.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346793830e0e7b5d%3A0x2d046bca6b2abb08!2z5a6c6Jit57ij!5e0!3m2!1szh-TW!2stw!4v1"
                                allowFullScreen loading="lazy"></iframe>
                        </div>
                        <div className={styles.locationInfo}>
                            <h3>如何抵達玩宜蘭</h3>
                            <div className={styles.locationDetail}>
                                <div className={styles.icon}>🚗</div>
                                <div>
                                    <div className={styles.label}>自行開車</div>
                                    <div className={styles.text}>國道五號下宜蘭交流道，沿XX路前行約10分鐘即可抵達。民宿備有免費停車場。</div>
                                </div>
                            </div>
                            <div className={styles.locationDetail}>
                                <div className={styles.icon}>🚄</div>
                                <div>
                                    <div className={styles.label}>搭乘火車</div>
                                    <div className={styles.text}>至宜蘭火車站或羅東火車站下車，可搭乘計程車約15分鐘抵達，或事先預約接駁服務。</div>
                                </div>
                            </div>
                            <div className={styles.locationDetail}>
                                <div className={styles.icon}>🚌</div>
                                <div>
                                    <div className={styles.label}>客運巴士</div>
                                    <div className={styles.text}>搭乘首都客運或葛瑪蘭客運至宜蘭轉運站，再轉乘計程車或預約接駁。</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scenic Spots Section */}
            <section className={styles.spotsSection} id="spots">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>鄰近景點</div>
                    <div className={styles.en}>Scenic Spots</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>
                <div className={`${styles.spotsGrid} ${styles.reveal}`} ref={addToRefs}>
                    <SpotCard img="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=400&fit=crop" name="幾米廣場" time="車程約 10 分鐘" />
                    <SpotCard img="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=400&fit=crop" name="羅東夜市" time="車程約 15 分鐘" />
                    <SpotCard img="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=400&fit=crop" name="太平山國家森林遊樂區" time="車程約 60 分鐘" />
                    <SpotCard img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400&fit=crop" name="冬山河親水公園" time="車程約 10 分鐘" />
                    <SpotCard img="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=500&h=400&fit=crop" name="礁溪溫泉" time="車程約 25 分鐘" />
                    <SpotCard img="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop" name="蘭陽博物館" time="車程約 20 分鐘" />
                </div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection} id="contact">
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.line}></div>
                    <div className={styles.zh}>聯絡我們</div>
                    <div className={styles.en}>Contact Us</div>
                    <div className={styles.deco}>
                        <div className={styles.decoLine}></div>
                        <div className={styles.decoDot}></div>
                        <div className={styles.decoLine}></div>
                    </div>
                </div>
                <div className={styles.contactContent}>
                    <div className={`${styles.contactInfoGrid} ${styles.reveal}`} ref={addToRefs}>
                        <ContactItem icon={<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />} label="電話" value="0912-345-678" />
                        <ContactItem icon={<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />} label="LINE ID" value="@hinokiforest" />
                        <ContactItem icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>} label="信箱" value="info@hinokiforest.com" />
                        <ContactItem icon={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>} label="地址" value="宜蘭縣XX鄉XX路XX號" />
                    </div>
                    <div className={`${styles.contactActions} ${styles.reveal}`} ref={addToRefs}>
                        <a href="#" className={styles.contactAction}>
                            <div className={styles.actionIcon}>📘</div>
                            <div className={styles.actionLabel}>Facebook</div>
                            <div className={styles.actionSub}>Our Facebook</div>
                        </a>
                        <a href="tel:0912345678" className={styles.contactAction}>
                            <div className={styles.actionIcon}>📞</div>
                            <div className={styles.actionLabel}>直接撥號</div>
                            <div className={styles.actionSub}>Call Me</div>
                        </a>
                        <a href="#" className={styles.contactAction}>
                            <div className={styles.actionIcon}>💬</div>
                            <div className={styles.actionLabel}>LINE 好友</div>
                            <div className={styles.actionSub}>LINE Me</div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerLogo}>玩宜蘭民宿</div>
                <div className={styles.footerEn}>Hinoki Forest Guesthouse</div>
                <div className={styles.footerLegal}>宜蘭縣合法民宿 第XXXX號</div>
                <div className={styles.footerShare}>
                    <a href="#" title="LINE">L</a>
                    <a href="#" title="Facebook">f</a>
                    <a href="#" title="Email">✉</a>
                </div>
                <div className={styles.footerCopyright}>
                    玩宜蘭民宿 | Copyright© All Rights Reserved.
                </div>
            </footer>

            {/* Go to Top */}
            <button
                className={`${styles.goTop} ${showTop ? styles.visible : ''}`}
                onClick={scrollToTop}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
                TOP
            </button>
        </div>
    );
}

// Helper Components
function RoomDetail({ icon, text }: { icon: string, text: string }) {
    const getIcon = (name: string) => {
        switch (name) {
            case 'size': return <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>;
            case 'bed': return <><path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7" /><path d="M2 7h20M7 7V4a1 1 0 011-1h8a1 1 0 011 1v3" /></>;
            case 'people': return <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></>;
            case 'amenities': return <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />;
            default: return null;
        }
    };

    return (
        <div className={styles.roomDetailItem}>
            <svg className={styles.roomDetailIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {getIcon(icon)}
            </svg>
            <div className={styles.roomDetailText}>{text}</div>
        </div>
    );
}

function NoticeItem({ title, text }: { title: string, text: React.ReactNode }) {
    return (
        <div className={styles.noticeItem}>
            <h4>{title}</h4>
            <p>{text}</p>
        </div>
    );
}

function SpotCard({ img, name, time }: { img: string, name: string, time: string }) {
    return (
        <div className={styles.spotCard}>
            <img src={img} alt={name} />
            <div className={styles.spotOverlay}>
                <div className={styles.spotName}>{name}</div>
                <div className={styles.spotDesc}>{time}</div>
            </div>
        </div>
    );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className={styles.contactInfoItem}>
            <div className={styles.contactIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {icon}
                </svg>
            </div>
            <div>
                <div className={styles.contactLabel}>{label}</div>
                <div className={styles.contactValue}>{value}</div>
            </div>
        </div>
    );
}
