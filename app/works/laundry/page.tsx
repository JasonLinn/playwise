"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './laundry.module.css';

const ITEMS = [
    { id: 'shirt', emoji: '👔', name: '襯衫', price: 80 },
    { id: 'pants', emoji: '👖', name: '褲子', price: 100 },
    { id: 'jacket', emoji: '🧥', name: '外套', price: 180 },
    { id: 'dress', emoji: '👗', name: '洋裝', price: 150 },
    { id: 'suit', emoji: '🤵', name: '西裝', price: 350 },
    { id: 'bedding', emoji: '🛏️', name: '床單被套', price: 250 },
];

const DATES = ['示範日 1', '示範日 2', '示範日 3', '示範日 4', '示範日 5'];
const TIMES = ['09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00'];
const PAY_OPTS = [
    { id: 'line-pay', icon: '💳', label: 'LINE Pay', sub: '付款選項示意' },
    { id: 'cash', icon: '💵', label: '現金付款', sub: '取件時付款' },
];

export default function LaundryPage() {
    const [step, setStep] = useState(1);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [deliverDate, setDeliverDate] = useState('');
    const [deliverTime, setDeliverTime] = useState('');
    const [payMethod, setPayMethod] = useState('line-pay');
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);

    const changeQty = (id: string, delta: number) => {
        setQuantities(prev => {
            const next = (prev[id] || 0) + delta;
            if (next <= 0) {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            }
            return { ...prev, [id]: next };
        });
    };

    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    const totalPrice = ITEMS.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price, 0);
    const selectedItems = ITEMS.filter(i => quantities[i.id] > 0);

    const step1Valid = totalItems > 0;
    const step2Valid = pickupDate && pickupTime && deliverDate && deliverTime;

    const handleConfirm = () => {
        setSuccess(true);
    };

    const handleReset = () => {
        setStep(1);
        setQuantities({});
        setPickupDate('');
        setPickupTime('');
        setDeliverDate('');
        setDeliverTime('');
        setPayMethod('line-pay');
        setNote('');
        setSuccess(false);
    };

    return (
        <div className={styles.page}>
            <Link href="/#portfolio" className={styles.backBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                返回首頁
            </Link>

            {/* Intro */}
            <div className={styles.intro}>
                <div className={styles.introIcon}>🧺</div>
                <h1 className={styles.introTitle}>洗衣廠 LIFF 訂單系統</h1>
                <p className={styles.introSub}>送洗與取件的前端互動示範，不會建立訂單、扣款或傳送 LINE 訊息</p>
                <div className={styles.introBadge}>
                    <span>LIFF Demo</span>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <span>互動展示</span>
                </div>
            </div>

            {/* Main layout */}
            <div className={styles.layout}>

                {/* Phone Frame */}
                <div className={styles.phoneFrame}>
                    <div className={styles.phoneOuter}>
                        <div className={styles.phoneInner}>
                            <div className={styles.phoneNotch} />
                            {/* Status bar */}
                            <div className={styles.phoneStatus}>
                                <span>9:41</span>
                                <div className={styles.phoneStatusRight}>
                                    <svg width="14" height="10" viewBox="0 0 20 14" fill="currentColor">
                                        <rect x="0" y="7" width="3" height="7" rx="1" opacity="0.4" />
                                        <rect x="5" y="4" width="3" height="10" rx="1" opacity="0.6" />
                                        <rect x="10" y="2" width="3" height="12" rx="1" opacity="0.8" />
                                        <rect x="15" y="0" width="3" height="14" rx="1" />
                                    </svg>
                                    <svg width="16" height="10" viewBox="0 0 24 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="0" y="4" width="22" height="11" rx="2" />
                                        <path d="M22 7v4a1.5 1.5 0 000-4z" fill="currentColor" stroke="none" />
                                        <rect x="2" y="6" width="14" height="7" rx="1" fill="currentColor" stroke="none" />
                                    </svg>
                                </div>
                            </div>

                            {/* LIFF Header */}
                            <div className={styles.liffHeader}>
                                <span className={styles.liffHeaderClose}>✕</span>
                                <span className={styles.liffHeaderTitle}>快潔洗衣 — 線上送洗</span>
                                <span className={styles.liffHeaderLogo}>🧺</span>
                            </div>

                            {/* Scrollable LIFF content */}
                            <div className={styles.phoneScroll}>
                                <div className={styles.liffContent}>

                                    {success ? (
                                        /* ===== SUCCESS ===== */
                                        <div className={styles.stepPanel}>
                                            <div className={styles.successScreen}>
                                                <div className={styles.successIcon}>✓</div>
                                                <div className={styles.successTitle}>示範完成！</div>
                                                <div className={styles.successSub}>
                                                    這是流程預覽，未送出訂單，<br />
                                                    不會安排收件或收取費用。
                                                </div>
                                                <div className={styles.orderNum}>示範編號：DEMO-0147（非實際訂單）</div>

                                                {/* LINE Notification bubble */}
                                                <div className={styles.lineNotif}>
                                                    <div className={styles.lineNotifHeader}>
                                                        <div className={styles.lineNotifAvatar}>🧺</div>
                                                        <div>
                                                            <div className={styles.lineNotifName}>快潔洗衣</div>
                                                        </div>
                                                        <div className={styles.lineNotifTime}>剛剛</div>
                                                    </div>
                                                    <div className={styles.lineNotifBubble}>
                                                        通知內容示意（未傳送）<br />
                                                        <strong>取件時間：</strong>{pickupDate} {pickupTime}<br />
                                                        <strong>件數：</strong>{totalItems} 件<br />
                                                        <strong>預估金額：</strong>NT$ {totalPrice}<br />
                                                        如需更改請回覆此訊息，謝謝！
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Step bar */}
                                            <div className={styles.stepBar}>
                                                {[
                                                    { n: 1, label: '選衣物' },
                                                    { n: 2, label: '預約時間' },
                                                    { n: 3, label: '確認付款' },
                                                ].map((s, i, arr) => (
                                                    <div key={s.n} className={styles.stepItem}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <div className={`${styles.stepDot} ${step > s.n ? styles.done : step === s.n ? styles.active : ''}`}>
                                                                {step > s.n ? '✓' : s.n}
                                                            </div>
                                                            <div className={`${styles.stepLabel} ${step === s.n ? styles.active : ''}`}>{s.label}</div>
                                                        </div>
                                                        {i < arr.length - 1 && (
                                                            <div className={`${styles.stepConnector} ${step > s.n ? styles.done : ''}`} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Step 1: 選衣物 */}
                                            {step === 1 && (
                                                <div className={styles.stepPanel}>
                                                    {/* User greeting */}
                                                    <div className={styles.userGreet}>
                                                        <div className={styles.userAvatar}>👤</div>
                                                        <div>
                                                            <div className={styles.userName}>王小明</div>
                                                            <div className={styles.userSub}>示範帳號 · 地址為示例</div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.panelTitle}>
                                                        <span>👕</span> 選擇送洗衣物
                                                    </div>

                                                    <div className={styles.itemGrid}>
                                                        {ITEMS.map(item => (
                                                            <button type="button"
                                                                key={item.id}
                                                                className={`${styles.itemCard} ${quantities[item.id] ? styles.selected : ''}`}
                                                                onClick={() => changeQty(item.id, 1)}
                                                                aria-label={`加入一件${item.name}`}
                                                            >
                                                                {quantities[item.id] > 0 && (
                                                                    <div className={styles.itemCheck}>✓</div>
                                                                )}
                                                                <span className={styles.itemEmoji}>{item.emoji}</span>
                                                                <div className={styles.itemName}>{item.name}</div>
                                                                <div className={styles.itemPrice}>NT$ {item.price} / 件</div>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {selectedItems.length > 0 && (
                                                        <>
                                                            <div className={styles.panelTitle} style={{ marginTop: '0.5rem' }}>
                                                                <span>🔢</span> 調整數量
                                                            </div>
                                                            {selectedItems.map(item => (
                                                                <div key={item.id} className={styles.qtyRow}>
                                                                    <div className={styles.qtyLabel}>
                                                                        <span>{item.emoji}</span>
                                                                        <span>{item.name}</span>
                                                                    </div>
                                                                    <div className={styles.qtyControls}>
                                                                        <button aria-label={`減少一件${item.name}`} className={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                                                                        <span className={styles.qtyNum}>{quantities[item.id]}</span>
                                                                        <button aria-label={`增加一件${item.name}`} className={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Step 2: 預約時間 */}
                                            {step === 2 && (
                                                <div className={styles.stepPanel}>
                                                    <div className={styles.panelTitle}>
                                                        <span>🚚</span> 預約取件時間
                                                    </div>
                                                    <div className={styles.dateCard}>
                                                        <div className={styles.dateLabel}>取件日期</div>
                                                        <div className={styles.dateOptions}>
                                                            {DATES.slice(0, 3).map(d => (
                                                                <button type="button"
                                                                    key={d}
                                                                    className={`${styles.dateChip} ${pickupDate === d ? styles.selected : ''}`}
                                                                    aria-pressed={pickupDate === d} onClick={() => { setPickupDate(d); setDeliverDate(''); }}
                                                                >{d}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={styles.dateCard}>
                                                        <div className={styles.dateLabel}>取件時段</div>
                                                        <div className={styles.timeGrid}>
                                                            {TIMES.map(t => (
                                                                <button type="button"
                                                                    key={t}
                                                                    className={`${styles.timeChip} ${pickupTime === t ? styles.selected : ''}`}
                                                                    aria-pressed={pickupTime === t} onClick={() => setPickupTime(t)}
                                                                >{t}</button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className={styles.panelTitle} style={{ marginTop: '0.25rem' }}>
                                                        <span>📦</span> 預約送件時間
                                                    </div>
                                                    <div className={styles.dateCard}>
                                                        <div className={styles.dateLabel}>送件日期（取件兩日後）</div>
                                                        {!pickupDate && <p>請先選擇取件日期</p>}
                                                        <div className={styles.dateOptions}>
                                                            {(pickupDate ? DATES.slice(DATES.indexOf(pickupDate) + 2) : []).map(d => (
                                                                <button type="button"
                                                                    key={d}
                                                                    className={`${styles.dateChip} ${deliverDate === d ? styles.selected : ''}`}
                                                                    aria-pressed={deliverDate === d} onClick={() => setDeliverDate(d)}
                                                                >{d}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className={styles.dateCard}>
                                                        <div className={styles.dateLabel}>送件時段</div>
                                                        <div className={styles.timeGrid}>
                                                            {TIMES.map(t => (
                                                                <button type="button"
                                                                    key={t}
                                                                    className={`${styles.timeChip} ${deliverTime === t ? styles.selected : ''}`}
                                                                    aria-pressed={deliverTime === t} onClick={() => setDeliverTime(t)}
                                                                >{t}</button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className={styles.addressCard}>
                                                        <div className={styles.addressRow}>
                                                            <span className={styles.addressIcon}>📍</span>
                                                            <span className={styles.addressText}>示範地址 · 不安排實際收送</span>

                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3: 確認付款 */}
                                            {step === 3 && (
                                                <div className={styles.stepPanel}>
                                                    <div className={styles.panelTitle}>
                                                        <span>📋</span> 訂單確認
                                                    </div>
                                                    <div className={styles.summaryCard}>
                                                        {selectedItems.map(item => (
                                                            <div key={item.id} className={styles.summaryRow}>
                                                                <span className={styles.summaryKey}>{item.emoji} {item.name} × {quantities[item.id]}</span>
                                                                <span className={styles.summaryVal}>NT$ {item.price * quantities[item.id]}</span>
                                                            </div>
                                                        ))}
                                                        <div className={styles.summaryRow}>
                                                            <span className={styles.summaryKey}>取件時間</span>
                                                            <span className={styles.summaryVal}>{pickupDate} {pickupTime}</span>
                                                        </div>
                                                        <div className={styles.summaryRow}>
                                                            <span className={styles.summaryKey}>送件時間</span>
                                                            <span className={styles.summaryVal}>{deliverDate} {deliverTime}</span>
                                                        </div>
                                                        <div className={styles.summaryTotal}>
                                                            <span className={styles.summaryTotalKey}>合計</span>
                                                            <span className={styles.summaryTotalVal}>NT$ {totalPrice}</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.panelTitle}>
                                                        <span>💳</span> 付款方式
                                                    </div>
                                                    <div className={styles.payOptions}>
                                                        {PAY_OPTS.map(opt => (
                                                            <button type="button"
                                                                key={opt.id}
                                                                className={`${styles.payOption} ${payMethod === opt.id ? styles.selected : ''}`}
                                                                aria-pressed={payMethod === opt.id} onClick={() => setPayMethod(opt.id)}
                                                            >
                                                                <span className={styles.payOptionIcon}>{opt.icon}</span>
                                                                <div style={{ flex: 1 }}>
                                                                    <div className={styles.payOptionLabel}>{opt.label}</div>
                                                                    <div className={styles.payOptionSub}>{opt.sub}</div>
                                                                </div>
                                                                <div className={`${styles.payRadio} ${payMethod === opt.id ? styles.checked : ''}`} />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className={styles.noteInput}>
                                                        <div className={styles.panelTitle} style={{ marginBottom: '0.5rem' }}>
                                                            <span>✏️</span> 備註
                                                        </div>
                                                        <textarea aria-label="示範訂單備註"
                                                            className={styles.noteTextarea}
                                                            placeholder="例如：衣物有特殊污漬、需特別注意的材質..."
                                                            value={note}
                                                            onChange={e => setNote(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bottom action */}
                            {!success && (
                                <div className={styles.bottomAction}>
                                    {step === 1 && (
                                        <button
                                            className={styles.actionBtn}
                                            disabled={!step1Valid}
                                            onClick={() => setStep(2)}
                                        >
                                            下一步：預約時間
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                    )}
                                    {step === 2 && (
                                        <>
                                            <button
                                                className={styles.actionBtn}
                                                disabled={!step2Valid}
                                                onClick={() => setStep(3)}
                                            >
                                                下一步：確認訂單
                                            </button>
                                            <button className={styles.actionBtnSecondary} onClick={() => setStep(1)}>
                                                上一步
                                            </button>
                                        </>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <button className={styles.actionBtn} onClick={handleConfirm}>
                                                完成示範
                                            </button>
                                            <button className={styles.actionBtnSecondary} onClick={() => setStep(2)}>
                                                上一步
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            {success && (
                                <div className={styles.bottomAction}>
                                    <button className={styles.actionBtn} onClick={handleReset}>
                                        重新體驗
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className={styles.infoPanel}>
                    <div className={styles.infoBadgeRow}>
                        <span className={`${styles.badge} ${styles.badgeLine}`}>LINE LIFF</span>
                        <span className={`${styles.badge} ${styles.badgeLiff}`}>自動化訂單</span>
                        <span className={`${styles.badge} ${styles.badgeAuto}`}>即時通知</span>
                    </div>
                    <h2 className={styles.infoTitle}>
                        洗衣廠 LIFF<br />自動送洗訂單系統
                    </h2>
                    <p className={styles.infoDesc}>
                        這個原型示範衣物選擇、取送預約與付款選項的操作流程。正式專案可再評估 LINE 登入、金流與通知串接；本頁以示例資料呈現，尚未連接這些服務。
                    </p>

                    <div className={styles.infoSection}>
                        <div className={styles.infoSectionTitle}>整合規劃</div>
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>🔗</div>
                                <div className={styles.featureText}>
                                    <h4>LINE 帳號綁定</h4>
                                    <p>可規劃 LINE 登入並在使用者授權後讀取必要資料；此處為示範帳號。</p>
                                </div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>📅</div>
                                <div className={styles.featureText}>
                                    <h4>智慧預約排程</h4>
                                    <p>示範取送時段選擇與先後順序；正式服務需串接店家產能與工作日。</p>
                                </div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>🔔</div>
                                <div className={styles.featureText}>
                                    <h4>全程自動通知</h4>
                                    <p>可規劃訂單與取件提醒；本頁只展示通知樣式，不會傳送訊息。</p>
                                </div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>💳</div>
                                <div className={styles.featureText}>
                                    <h4>LINE Pay 整合</h4>
                                    <p>展示線上與現金付款選項；正式金流須另行申請與串接，本頁不會扣款。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoSectionTitle}>正式服務流程構想</div>
                        <div className={styles.flowSteps}>
                            {[
                                { title: '點擊 LINE 選單', desc: '用戶從 LINE 官方帳號選單開啟 LIFF App' },
                                { title: '選擇送洗衣物', desc: '依衣物類型選擇並設定數量，即時顯示費用' },
                                { title: '預約取送時間', desc: '選擇取件與送件的日期時段及地址' },
                                { title: '確認並付款', desc: '核對訂單資訊，選擇付款方式後送出' },
                                { title: '自動 LINE 通知', desc: '系統立即推播確認通知，並於取件前再次提醒' },
                            ].map((s, i, arr) => (
                                <div key={i} className={styles.flowStep}>
                                    <div className={styles.flowLeft}>
                                        <div className={styles.flowNum}>{i + 1}</div>
                                        {i < arr.length - 1 && <div className={styles.flowLine} />}
                                    </div>
                                    <div className={styles.flowBody}>
                                        <div className={styles.flowTitle}>{s.title}</div>
                                        <div className={styles.flowDesc}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoSectionTitle}>可評估的整合技術</div>
                        <div className={styles.techStack}>
                            {['LINE LIFF SDK', 'LINE Messaging API', 'Next.js', 'LINE Pay API', 'Node.js', 'PostgreSQL', 'Vercel'].map(t => (
                                <span key={t} className={styles.techChip}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
