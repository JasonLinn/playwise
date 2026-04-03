"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './washpass.module.css';

export default function LaundryPage() {
    const [loading, setLoading] = useState(true);
    const [showTop, setShowTop] = useState(false);
    const revealRefs = useRef<(HTMLElement | null)[]>([]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);

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

        const handleScroll = () => setShowTop(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* Preloader */}
            <div className={`${styles.preloader} ${!loading ? styles.hidden : ''}`}>
                <div className={styles.preloaderContent}>
                    <div className={styles.preloaderLogo}>
                        <span className={styles.preloaderIcon}>🧺</span>
                        <span className={styles.preloaderText}>洗務通</span>
                    </div>
                    <div className={styles.preloaderBar}>
                        <div className={styles.preloaderProgress}></div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    返回作品集
                </Link>
                <div className={styles.navLogo}>洗務通</div>
                <a href="https://liff-laundry.vercel.app/introduce" target="_blank" rel="noopener noreferrer" className={styles.navCta}>
                    查看網站 →
                </a>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <div className={styles.heroBgGradient}></div>
                    <div className={styles.heroBgDots}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.heroTag}>SaaS · B2B · LINE Integration</div>
                    <h1 className={styles.heroTitle}>
                        洗務通
                        <span className={styles.heroTitleEn}>WashPass</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        專為大型洗被單廠打造的數位化營運大腦<br />
                        串接 LINE，讓民宿業者一鍵完成預約，廠端後台批次審核輕鬆排程
                    </p>
                    <div className={styles.heroActions}>
                        <a href="https://liff-laundry.vercel.app/introduce" target="_blank" rel="noopener noreferrer" className={styles.heroBtnPrimary}>
                            體驗介紹頁
                        </a>
                        <a href="https://liff-laundry.vercel.app/admin" target="_blank" rel="noopener noreferrer" className={styles.heroBtnSecondary}>
                            廠端管理後台
                        </a>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>3</div>
                            <div className={styles.heroStatLabel}>核心功能模組</div>
                        </div>
                        <div className={styles.heroStatDivider}></div>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>LINE</div>
                            <div className={styles.heroStatLabel}>原生整合預約</div>
                        </div>
                        <div className={styles.heroStatDivider}></div>
                        <div className={styles.heroStat}>
                            <div className={styles.heroStatNum}>SaaS</div>
                            <div className={styles.heroStatLabel}>多租戶架構</div>
                        </div>
                    </div>
                </div>
                <div className={styles.heroMockup}>
                    <div className={styles.mockupDesktop}>
                        <div className={styles.mockupTopBar}>
                            <div className={styles.mockupDots}>
                                <span></span><span></span><span></span>
                            </div>
                            <div className={styles.mockupUrl}>laundrytech.com/admin/dashboard</div>
                        </div>
                        <div className={styles.mockupScreen}>
                            <div className={styles.mockupDashboard}>
                                <div className={styles.mockupSidebar}>
                                    <div className={styles.mockupSidebarLogo}>洗務通</div>
                                    <div className={`${styles.mockupSidebarItem} ${styles.active}`}>📋 預約管理</div>
                                    <div className={styles.mockupSidebarItem}>🏨 合作民宿</div>
                                    <div className={styles.mockupSidebarItem}>📊 數據報表</div>
                                    <div className={styles.mockupSidebarItem}>⚙️ 系統設定</div>
                                </div>
                                <div className={styles.mockupMain}>
                                    <div className={styles.mockupHeader}>
                                        <div className={styles.mockupTitle}>收件預約管理</div>
                                    </div>
                                    <div className={styles.mockupCards}>
                                        <div className={styles.mockupCard} style={{ borderLeft: '3px solid #ef4444' }}>
                                            <div className={styles.mockupCardNum}>12</div>
                                            <div className={styles.mockupCardLabel}>今日待收件</div>
                                        </div>
                                        <div className={styles.mockupCard} style={{ borderLeft: '3px solid #f59e0b' }}>
                                            <div className={styles.mockupCardNum}>0</div>
                                            <div className={styles.mockupCardLabel}>待確認預約</div>
                                        </div>
                                        <div className={styles.mockupCard} style={{ borderLeft: '3px solid #10b981' }}>
                                            <div className={styles.mockupCardNum}>45</div>
                                            <div className={styles.mockupCardLabel}>已確認預約</div>
                                        </div>
                                    </div>
                                    <div className={styles.mockupTable}>
                                        <div className={styles.mockupTableRow} style={{ background: '#f8fafc', fontWeight: 600, fontSize: '0.6rem' }}>
                                            <span>日期</span><span>合作民宿</span><span>狀態</span>
                                        </div>
                                        {[
                                            { date: '04-12', name: '星空海景民宿', status: '已確認', color: '#10b981' },
                                            { date: '04-12', name: '山林渡假村', status: '已確認', color: '#10b981' },
                                            { date: '04-13', name: '陽光沙灘旅店', status: '確認中', color: '#f59e0b' },
                                        ].map((row, i) => (
                                            <div key={i} className={styles.mockupTableRow}>
                                                <span>2026-{row.date}</span>
                                                <span>{row.name}</span>
                                                <span style={{ color: row.color, fontWeight: 600 }}>{row.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mockupPhone}>
                        <div className={styles.mockupPhoneScreen}>
                            <div className={styles.mockupPhoneHeader}>
                                <div className={styles.mockupPhoneTitle}>🧺 洗衣收送預約系統</div>
                                <div className={styles.mockupPhoneSubTitle}>星空海景民宿</div>
                            </div>
                            <div className={styles.mockupCalendar}>
                                <div className={styles.mockupCalendarHeader}>2026 年 4月</div>
                                <div className={styles.mockupCalendarGrid}>
                                    {['日','一','二','三','四','五','六'].map(d => (
                                        <div key={d} className={styles.mockupCalendarDay} style={{ fontWeight: 700, color: '#6b7280', fontSize: '0.55rem' }}>{d}</div>
                                    ))}
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <div key={i} className={`${styles.mockupCalendarDay} ${i + 1 === 12 ? styles.today : ''} ${[6,13,17].includes(i+1) ? styles.selected : ''}`}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.mockupPhoneBtn}>立即預約 2 日收件</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenge + Solution */}
            <section className={styles.challengeSection} ref={addToRefs as (el: HTMLElement | null) => void}>
                <div className={`${styles.challengeContent} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.challengeLeft}>
                        <div className={styles.sectionTag}>問題背景</div>
                        <h2>洗被廠的日常困境</h2>
                        <div className={styles.painPoints}>
                            {[
                                { icon: '📞', title: '電話轟炸', desc: '每天早上接不完的確認電話，打斷工作節奏' },
                                { icon: '📝', title: '紙本失誤', desc: '手寫訂單容易寫錯、漏記，造成糾紛' },
                                { icon: '💬', title: 'LINE 群組混亂', desc: '多個 LINE 群組訊息雜亂，難以追蹤' },
                                { icon: '😤', title: '客戶流失', desc: '繁瑣流程讓民宿業者選擇其他廠商' },
                            ].map((p, i) => (
                                <div key={i} className={styles.painPoint}>
                                    <div className={styles.painIcon}>{p.icon}</div>
                                    <div>
                                        <div className={styles.painTitle}>{p.title}</div>
                                        <div className={styles.painDesc}>{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.challengeRight}>
                        <div className={styles.sectionTag}>解決方案</div>
                        <h2>洗務通如何改變一切</h2>
                        <div className={styles.solutions}>
                            {[
                                { step: '01', title: '廠端申請專屬連結', desc: '5 分鐘完成設定，獲得專屬 LINE 預約頁面' },
                                { step: '02', title: '加入原有 LINE 群組', desc: '不改變業者習慣，在熟悉的 LINE 環境完成預約' },
                                { step: '03', title: '自動同步後台行事曆', desc: '所有預約即時進入廠端系統，批次審核一次搞定' },
                            ].map((s, i) => (
                                <div key={i} className={styles.solutionStep}>
                                    <div className={styles.solutionStepNum}>{s.step}</div>
                                    <div>
                                        <div className={styles.solutionTitle}>{s.title}</div>
                                        <div className={styles.solutionDesc}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.featuresSection}>
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.sectionTag}>核心功能</div>
                    <h2>三大模組，全方位數位化</h2>
                </div>
                <div className={`${styles.featuresGrid} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                            </svg>
                        </div>
                        <h3>專屬 LINE LIFF 介面</h3>
                        <p>民宿業者無須額外下載繁瑣的 App，直接從營業用的 LINE 群組進入專屬預約書布，防呆日曆設計，一次點選多天預約無比直覺。</p>
                        <div className={styles.featureTags}>
                            <span>LINE LIFF</span>
                            <span>防呆日曆</span>
                            <span>行動優先</span>
                        </div>
                    </div>
                    <div className={styles.featureCard} style={{ '--card-accent': '#6366f1' } as React.CSSProperties}>
                        <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <h3>廠端智慧批次管理</h3>
                        <p>洗衣廠後台將所有預約統整為清單，預設自動核准減低人工工業，只需在繁忙無法調度、車輛滿載時點選「批次取消」即可。</p>
                        <div className={styles.featureTags}>
                            <span>批次審核</span>
                            <span>智慧排程</span>
                            <span>彈性調度</span>
                        </div>
                    </div>
                    <div className={styles.featureCard} style={{ '--card-accent': '#f59e0b' } as React.CSSProperties}>
                        <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                        <h3>營運數據視覺化</h3>
                        <p>一目了然看見今日收件數量與各間民宿的分佈，隨時追蹤歷史紀錄與未來的每日次旺季趨勢，幫助廠端精準優化運力與人力配置。</p>
                        <div className={styles.featureTags}>
                            <span>即時儀表板</span>
                            <span>趨勢分析</span>
                            <span>人力規劃</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className={styles.techSection}>
                <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.sectionTag}>技術架構</div>
                    <h2>現代化全端技術選型</h2>
                </div>
                <div className={`${styles.techGrid} ${styles.reveal}`} ref={addToRefs}>
                    {[
                        { category: 'Frontend', items: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS'] },
                        { category: 'Backend', items: ['Next.js API Routes', 'Prisma ORM', 'PostgreSQL', 'Neon DB'] },
                        { category: 'Integration', items: ['LINE LIFF', 'LINE Messaging API', 'LINE OAuth', 'Vercel Deploy'] },
                        { category: 'Architecture', items: ['Multi-tenant SaaS', 'Server Components', 'Edge Functions', 'JWT Auth'] },
                    ].map((tech, i) => (
                        <div key={i} className={styles.techCard}>
                            <div className={styles.techCategory}>{tech.category}</div>
                            <div className={styles.techItems}>
                                {tech.items.map((item, j) => (
                                    <div key={j} className={styles.techItem}>{item}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Value Proposition */}
            <section className={styles.valueSection}>
                <div className={`${styles.valueContent} ${styles.reveal}`} ref={addToRefs}>
                    <div className={styles.sectionTag}>產品價值</div>
                    <h2>更簡單的流程，為您帶來更多的合作夥伴</h2>
                    <p>民宿老闆最討厭每天早上打電話確認收被罩，或在 LINE 群組焦慮等待回覆。一套好的預約系統不只幫您省下客服時間，更是您爭取新合約的最佳武器。</p>
                    <div className={styles.valueStats}>
                        <div className={styles.valueStat}>
                            <div className={styles.valueStatIcon}>⏱️</div>
                            <div className={styles.valueStatTitle}>節省 80% 客服時間</div>
                            <div className={styles.valueStatDesc}>自動化預約流程，告別電話轟炸</div>
                        </div>
                        <div className={styles.valueStat}>
                            <div className={styles.valueStatIcon}>📈</div>
                            <div className={styles.valueStatTitle}>提升廠商專業形象</div>
                            <div className={styles.valueStatDesc}>專業數位系統，讓客戶更信任你</div>
                        </div>
                        <div className={styles.valueStat}>
                            <div className={styles.valueStatIcon}>🔗</div>
                            <div className={styles.valueStatTitle}>零學習成本導入</div>
                            <div className={styles.valueStatDesc}>業者不需新 App，在 LINE 完成一切</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={`${styles.ctaContent} ${styles.reveal}`} ref={addToRefs}>
                    <h2>想了解更多這個專案？</h2>
                    <p>立即前往洗務通介紹頁，或直接前往廠端管理後台體驗系統功能</p>
                    <div className={styles.ctaActions}>
                        <a href="https://liff-laundry.vercel.app/introduce" target="_blank" rel="noopener noreferrer" className={styles.ctaBtnPrimary}>
                            查看介紹頁面
                        </a>
                        <Link href="/" className={styles.ctaBtnSecondary}>
                            回到作品集首頁
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>Playwise Studio</div>
                    <div className={styles.footerLinks}>
                        <Link href="/">← 返回首頁</Link>
                        <Link href="/works/bnb">玩宜蘭民宿</Link>
                    </div>
                </div>
                <div className={styles.footerCopy}>© 2026 Playwise Studio. All rights reserved.</div>
            </footer>

            {/* Go Top */}
            <button
                className={`${styles.goTop} ${showTop ? styles.goTopVisible : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="回到頂端"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            </button>
        </div>
    );
}
