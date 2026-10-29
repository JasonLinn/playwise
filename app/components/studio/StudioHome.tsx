import Image from "next/image";
import Link from "next/link";
import tide from "../../../public/images/studio/tide.jpg";
import mist from "../../../public/images/studio/mist.jpg";
import StudioHeader from "./StudioHeader";
import WorkflowPlayground from "./WorkflowPlayground";
import styles from "./studio.module.css";

const services = [
  [
    "01",
    "讓品牌，被好好看見。",
    "品牌網站設計",
    "把品牌的個性、服務與體驗，整理成一個清楚、好看、好操作的網站。從手機閱讀到聯絡入口，每一步都為你的客人想。",
    "品牌官網 / 旅宿網站 / 網站改版",
  ],
  [
    "02",
    "讓日常，自己走下去。",
    "工作流程自動化",
    "從表單、預約到提醒，找出值得串接的重複工作。先解決最常卡住的一步，再逐步擴充，讓系統配合你的工作方式。",
    "表單整合 / 訂單整理 / 通知提醒",
  ],
  [
    "03",
    "讓回應，多一位幫手。",
    "LINE 與智慧客服",
    "整理常見問題與品牌語氣，規劃 LINE 服務及客服助理。能自動處理的先處理，需要人判斷的，留下明確的接手方式。",
    "LINE LIFF / 常見問答 / 人工接手",
  ],
];

export default function StudioHome() {
  return (
    <div className={styles.site} id="top">
      <a className={styles.skip} href="#main-content">
        跳至主要內容
      </a>
      <StudioHeader />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroMeta}>
            <p>INDEPENDENT DIGITAL STUDIO</p>
            <p>宜蘭出發，為每一份用心而做。</p>
            <span aria-hidden="true">↘</span>
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1 id="hero-title">
                讓工作更聰明，
                <br />
                讓生活<span className={styles.serif}>有餘裕。</span>
              </h1>
              <p className={styles.heroDescription}>
                有個性的網站，懂日常的系統。
                <br />
                我們陪民宿、小店與獨立工作者，
                <br />
                把心力留給真正喜歡的事。
              </p>
              <a className={styles.roundLink} href="#portfolio">
                探索我們的作品 <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className={styles.heroArt} aria-hidden="true">
              <div className={styles.artCaption}>
                A LITTLE SPACE
                <br />
                FOR THE GOOD THINGS.
              </div>
              <svg viewBox="0 0 560 480" fill="none">
                <path
                  className={styles.ribbonBack}
                  d="M130 345C-30 155 195 55 270 180C340 297 115 420 156 220C202-12 535 85 430 280C350 425 255 340 300 220C345 100 535 230 420 350"
                />
                <path
                  className={styles.ribbon}
                  d="M130 345C-30 155 195 55 270 180C340 297 115 420 156 220C202-12 535 85 430 280C350 425 255 340 300 220C345 100 535 230 420 350"
                />
                <circle cx="423" cy="353" r="18" fill="#f3efe5" />
              </svg>
              <span className={styles.artLabel}>把複雜理順，把時間留白。</span>
              <span className={styles.artIndex}>FIG. 01 — 餘裕</span>
            </div>
          </div>
          <div className={styles.heroBottom}>
            <span>WEB DESIGN & DIGITAL AUTOMATION</span>
            <a href="#services">
              設計 × 技術 × 日常 <span aria-hidden="true">↓</span>
            </a>
            <span>YILAN, TAIWAN</span>
          </div>
        </section>

        <section
          id="portfolio"
          className={styles.workSection}
          aria-labelledby="work-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>01 / SELECTED WORK</p>
            <h2 id="work-title">
              把想像，<span className={styles.serif}>做成日常。</span>
            </h2>
            <p>
              從一間民宿的氣質，
              <br />
              到一套系統的細節。
            </p>
          </div>
          <div className={styles.workGrid}>
            <Link
              href="/works/tide"
              prefetch={false}
              className={styles.workCard}
            >
              <div className={`${styles.workImage} ${styles.tideImage}`}>
                <Image
                  src={tide}
                  alt="潮間概念官網：海岸影像與 Between Tides 大字排版"
                  sizes="(max-width: 760px) 92vw, 55vw"
                />
                <span className={styles.visit}>探索作品 ↗</span>
              </div>
              <div className={styles.workMeta}>
                <span>01 / HOSPITALITY</span>
                <span>概念設計</span>
              </div>
              <h3>
                潮間 <span>Between Tides</span>
                <b aria-hidden="true">↗</b>
              </h3>
              <p>把海的節奏，帶進一次住宿的開始。</p>
              <span className={styles.workTags}>
                品牌敘事 · 潮汐互動 · 訂房流程示範
              </span>
            </Link>
            <Link
              href="/works/mist"
              prefetch={false}
              className={`${styles.workCard} ${styles.mistCard}`}
            >
              <div className={`${styles.workImage} ${styles.mistImage}`}>
                <Image
                  src={mist}
                  alt="霧裡山房概念官網：茶山影像、直排文字與節氣設計"
                  sizes="(max-width: 760px) 92vw, 42vw"
                />
                <span className={styles.visit}>探索作品 ↗</span>
              </div>
              <div className={styles.workMeta}>
                <span>02 / HOSPITALITY</span>
                <span>概念設計</span>
              </div>
              <h3>
                霧裡山房 <span>Mist House</span>
                <b aria-hidden="true">↗</b>
              </h3>
              <p>讓一杯茶的時間，成為網站的節奏。</p>
              <span className={styles.workTags}>
                節氣體驗 · 泡茶計時 · 房費試算
              </span>
            </Link>
          </div>
          <p className={styles.conceptNote}>
            潮間與霧裡山房為虛構旅宿概念作品，用來展示設計與互動，不提供實際訂房。
          </p>
          <div className={styles.moreWorks}>
            {[
              ["03", "日式民宿", "住宿品牌網站", "/works/bnb"],
              ["04", "洗衣廠 LIFF", "LINE 訂單流程展示", "/works/laundry"],
              ["05", "洗務通 WashPass", "洗滌管理系統展示", "/works/washpass"],
            ].map(([n, title, desc, href]) => (
              <Link href={href} prefetch={false} key={href}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="services"
          className={styles.services}
          aria-labelledby="services-title"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>02 / WHAT WE DO</p>
            <h2 id="services-title">
              好看之外，
              <br />
              <span className={styles.serif}>也要好用。</span>
            </h2>
            <p>
              不必一次改變所有事情。
              <br />
              從最需要的一步開始。
            </p>
          </div>
          <div className={styles.serviceRows}>
            {services.map(([n, title, label, desc, tags]) => (
              <article key={n} className={styles.serviceRow}>
                <span>{n}</span>
                <div>
                  <p className={styles.serviceLabel}>{label}</p>
                  <h3>{title}</h3>
                </div>
                <div>
                  <p>{desc}</p>
                  <small>{tags}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
        <WorkflowPlayground />

        <section
          id="clients"
          className={styles.process}
          aria-labelledby="process-title"
        >
          <div className={styles.processIntro}>
            <p className={styles.eyebrow}>03 / WORKING TOGETHER</p>
            <h2 id="process-title">
              先聊生活，
              <br />
              <span className={styles.serif}>再聊技術。</span>
            </h2>
            <p>
              你最了解自己的生意。
              <br />
              我們把你每天遇到的事，變成設計的起點。
            </p>
            <a href="#contact" className={styles.textLink}>
              從一個問題開始聊 <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ol className={styles.steps}>
            {[
              [
                "聊聊現在",
                "了解你的客人、工作方式，以及最想改善的問題。沒有規格書，也可以開始。",
              ],
              [
                "一起釐清",
                "確認服務範圍、所需素材、費用與時程。先把期待說清楚，再進入製作。",
              ],
              [
                "做出來，試著用",
                "從設計到開發，透過預覽與實際操作調整細節，確認手機上也順手。",
              ],
              [
                "上線，也交接",
                "確認內容與功能後上線，說明日常操作；後續維護依約定的範圍進行。",
              ],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div>
            <p className={styles.eyebrow}>A FEW GOOD QUESTIONS</p>
            <h2 id="faq-title">
              開始之前，
              <br />
              你可能想知道。
            </h2>
          </div>
          <div>
            {[
              [
                "已經有網站，可以只改需要的部分嗎？",
                "可以先一起看現有網站，釐清內容、手機體驗與管理方式。評估後，再決定局部調整或重新製作，以及可以沿用哪些素材。",
              ],
              [
                "我不懂技術，也沒有完整想法。",
                "從你每天最花時間的事情說起就好。我們會協助整理需求，說明可能的做法與限制，再一起決定優先順序。",
              ],
              [
                "費用與製作時間怎麼估算？",
                "依頁面內容、功能、串接項目與素材準備狀況評估。確認需求後提供範圍與報價，平台或第三方服務費用也會分開說明。",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">＋</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className={styles.contact}
          aria-labelledby="contact-title"
        >
          <div className={styles.contactTop}>
            <p className={styles.eyebrow}>
              GOOD THINGS START WITH A CONVERSATION.
            </p>
            <span aria-hidden="true">↗</span>
          </div>
          <h2 id="contact-title">
            下一個好點子，
            <br />
            <span className={styles.serif}>從我們聊聊開始。</span>
          </h2>
          <div className={styles.contactBottom}>
            <p>
              一個網站，一段流程，或一個還沒成形的想法。
              <br />
              告訴我們，你想把時間留給什麼。
            </p>
            <a
              href="https://lin.ee/N4ukE55"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactButton}
            >
              在 LINE 聊聊 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a href="/" className={styles.footerLogo}>
            playwise<span>↗</span>
          </a>
          <p>
            智遊工作室
            <br />
            讓工作更輕鬆，讓生活更自由。
          </p>
          <div>
            <a href="tel:0928836163">0928-836-163 ↗</a>
            <p>宜蘭縣冬山鄉武淵三路 120 號</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} PLAYWISE STUDIO</span>
          <span>營業人名稱：智遊工作室 · 統一編號：60165085</span>
          <a href="#top">回到頂端 ↑</a>
        </div>
      </footer>
    </div>
  );
}
