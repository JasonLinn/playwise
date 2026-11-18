import Image from "next/image";
import Link from "next/link";
import tide from "../../../public/images/studio/tide.jpg";
import mist from "../../../public/images/studio/mist.jpg";
import StudioHeader from "./StudioHeader";
import WorkflowPlayground from "./WorkflowPlayground";
import ConsultationBrief from "./ConsultationBrief";
import ConsultationLink from "./ConsultationLink";
import AutomationShowcase from "./AutomationShowcase";
import LiveProjects from "./LiveProjects";
import HeroShowcase from "./HeroShowcase";
import styles from "./studio.module.css";

const services = [
  [
    "01",
    "讓品牌，被好好看見。",
    "品牌網站設計",
    "把品牌的個性、服務與體驗，整理成一個清楚、好看、好操作的網站。從手機閱讀到聯絡入口，每一步都為你的客人想。",
    "品牌官網 / 旅宿網站 / 網站改版",
    "/works/tide",
    "看網站設計範例",
  ],
  [
    "02",
    "讓日常，自己走下去。",
    "工作流程自動化",
    "每天都在重複做一樣的事？我們幫你把表單、預約、提醒串起來，讓事情「自己動起來」。先解決最常卡住的一步，再慢慢擴充。",
    "表單送出自動通知 / 訂單名單自動整理 / 定時發訊息提醒",
    "/works/laundry",
    "試用訂單流程原型",
  ],
  [
    "03",
    "讓回應，多一位幫手。",
    "LINE 與智慧客服",
    "想讓你的 LINE 有個會回答問題的小幫手嗎？常見問題客人一問就答，還能引導預約、報名或查詢；需要你判斷的，再清楚交給你接手。",
    "LINE LIFF / 常見問答 / 人工接手",
    "/works/laundry",
    "看 LINE 訂單介面示範",
  ],
];

const LINE_URL = "https://lin.ee/N4ukE55";

const audiences = [
  [
    "民宿 / 小店家 / 創作者",
    "讓預約、訂單、客服這些日常工作自動化，省下時間，專心經營客人的體驗。",
    "例如：衿日林民宿官網",
  ],
  [
    "一人公司 / 自由接案者",
    "把重複的行政流程交給系統處理，專注在你最擅長的事，同時維持專業形象。",
    "例如：表單、報價、提醒自動化",
  ],
  [
    "小型協會 / 社群 / 團隊",
    "簡化會員、活動與通知的管理，讓成員溝通更順，資訊不再散落各處。",
    "例如：宜蘭旅遊通（協會平台）",
  ],
];

const heroServices = [
  ["品牌網站", "民宿官網、店家網站、舊網站改版"],
  ["LINE 服務", "LINE 登入、領券、集章、線上訂單"],
  ["流程自動化", "表單、預約、通知與後台整理"],
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
              <p className={styles.heroKicker}>
                宜蘭的網站與 LINE 系統工作室
              </p>
              <h1 id="hero-title" className={styles.heroTitle}>
                幫民宿與小店，
                <br />
                做網站、LINE
                <br />與<span className={styles.serif}>自動化流程。</span>
              </h1>
              <p className={styles.heroDescription}>
                我們是宜蘭的小團隊，幫民宿、小店、個人工作者和在地協會，把繁瑣的日常工作變得更聰明、更簡單。不懂技術也沒關係，從你每天最花時間的事聊起就好。
              </p>
              <ul className={styles.heroServices} aria-label="服務項目">
                {heroServices.map(([title, detail]) => (
                  <li key={title}>
                    <a href="#services">
                      <strong>{title}</strong>
                      <span>{detail}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className={styles.heroActions}>
                <a className={styles.roundLink} href="#portfolio">
                  看做過的案例 <span aria-hidden="true">↗</span>
                </a>
                <a
                  className={styles.lineButton}
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  用 LINE 直接問
                  <span className={styles.srOnly}>（另開新視窗）</span>
                </a>
              </div>
              <a className={styles.heroProof} href="#portfolio">
                <span>已上線</span>
                宜蘭旅遊通 · 衿日林民宿 · 冬山河漫遊護照
              </a>
            </div>
            <HeroShowcase />
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
              我們做過的<span className={styles.serif}>案例。</span>
            </h2>
            <p>
              先看已上線的真實案例，
              <br />
              再看設計示範。
            </p>
          </div>
          <LiveProjects />
          <div className={styles.liveHeading}>
            <h3>概念作品與原型</h3>
            <p>用來展示設計方向與互動體驗的示範作品。</p>
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
              <h4>
                潮間 <span>Between Tides</span>
                <b aria-hidden="true">↗</b>
              </h4>
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
              <h4>
                霧裡山房 <span>Mist House</span>
                <b aria-hidden="true">↗</b>
              </h4>
              <p>讓一杯茶的時間，成為網站的節奏。</p>
              <span className={styles.workTags}>
                節氣體驗 · 泡茶計時 · 房費試算
              </span>
            </Link>
          </div>
          <p className={styles.conceptNote}>
            潮間與霧裡山房為虛構旅宿概念作品，用來展示設計與互動，不提供實際訂房。
          </p>
          <AutomationShowcase />
          <div className={styles.moreWorks}>
            {[
              ["04", "日式民宿", "住宿品牌網站 · 概念設計", "/works/bnb"],
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
              我們可以
              <br />
              <span className={styles.serif}>幫你做什麼？</span>
            </h2>
            <p>
              不必一次改變所有事情。
              <br />
              從最需要的一步開始。
            </p>
          </div>
          <div className={styles.serviceRows}>
            {services.map(
              ([n, title, label, desc, tags, example, exampleLabel]) => (
                <article key={n} className={styles.serviceRow}>
                  <span>{n}</span>
                  <div>
                    <p className={styles.serviceLabel}>{label}</p>
                    <h3>{title}</h3>
                  </div>
                  <div>
                    <p>{desc}</p>
                    <small>{tags}</small>
                    <div className={styles.serviceActions}>
                      <Link href={example} prefetch={false}>
                        {exampleLabel} <span aria-hidden="true">↗</span>
                      </Link>
                      <ConsultationLink service={label} />
                    </div>
                    {n === "03" && (
                      <p className={styles.scopeNote}>
                        此範例展示 LINE
                        訂單介面；智慧客服與人工接手依需求另行規劃。
                      </p>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
        <section
          id="who"
          className={styles.audience}
          aria-labelledby="who-title"
        >
          <div className={styles.audienceHeading}>
            <p className={styles.eyebrow}>WHO WE HELP</p>
            <h2 id="who-title">我們最常協助的對象</h2>
            <p>
              不論你是經營小店、自由工作者，還是小型團隊，我們都從你的日常出發，找出最適合的做法。
            </p>
          </div>
          <ul className={styles.audienceList}>
            {audiences.map(([title, desc, example], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <small>{example}</small>
              </li>
            ))}
          </ul>
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
            <div className={styles.contactGuide}>
              <h3>先說說，哪件事最想改善？</h3>
              <p>
                一個網站，一段流程，或一個還沒成形的想法。告訴我們你的工作，以及現在最常卡住的一步。
              </p>
              <p>我們會先釐清需求，再討論適合的做法、範圍與報價。</p>
              <p className={styles.contactDirect}>
                不想打字？歡迎直接加 LINE 或打電話，一起聊聊！
              </p>
              <div className={styles.contactActions}>
                <a
                  className={styles.lineButton}
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  加入 LINE 好友
                  <span className={styles.srOnly}>（另開新視窗）</span>
                </a>
                <a className={styles.phoneLink} href="tel:0928836163">
                  電話 0928-836-163
                </a>
              </div>
            </div>
            <ConsultationBrief
              id="contact-message"
              initialText={
                "我經營／從事：\n目前網站或品牌名稱（選填）：\n最想改善的問題：\n希望完成的時間（選填）："
              }
            />
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
