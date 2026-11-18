import Image, { type StaticImageData } from "next/image";
import yilanpass from "../../../public/images/studio/live/yilanpass.jpg";
import jinbnb from "../../../public/images/studio/live/jinbnb.jpg";
import dsrpass from "../../../public/images/studio/live/dsrpass.jpg";
import styles from "./studio.module.css";

type LiveProject = {
  name: string;
  latin: string;
  category: string;
  summary: string;
  tags: string;
  href: string;
  domain: string;
  image: StaticImageData;
  alt: string;
  phone?: boolean;
};

const projects: LiveProject[] = [
  {
    name: "宜蘭旅遊通",
    latin: "YilanPass",
    category: "在地旅遊平台",
    summary:
      "宜蘭觀光民宿行銷協會發起的旅遊平台。整合在地店家電子優惠券、合法民宿查詢與活動資訊，用 LINE 登入就能領券。",
    tags: "平台設計與開發 · LINE 登入領券 · 優惠券與民宿查詢",
    href: "https://yilanpass.com",
    domain: "yilanpass.com",
    image: yilanpass,
    alt: "宜蘭旅遊通首頁：先領券再出發的搜尋區與熱門優惠券列表",
  },
  {
    name: "衿日林民宿",
    latin: "Jin B&B",
    category: "民宿官網",
    summary:
      "冬山河畔的包棟民宿官網。介紹房型與設施、刊登專屬優惠與最新消息，並把官網訂房與 LINE 好友放在客人找得到的地方。",
    tags: "官網設計與開發 · 最新消息後台 · 訂房與 LINE 入口",
    href: "https://jinbnb.com",
    domain: "jinbnb.com",
    image: jinbnb,
    alt: "衿日林民宿官網首頁：戲水池主視覺與最新消息",
  },
  {
    name: "冬山河漫遊護照",
    latin: "River Passport",
    category: "LINE 集章服務",
    summary:
      "沿冬山河散步或騎單車的數位護照。用 LINE 開啟後，旅伴角色帶路介紹每一站，到了現場用 GPS 集章，沿途收集旅印。",
    tags: "LINE LIFF 開發 · GPS 集章 · 景點導覽頁",
    href: "https://dsrpass.vercel.app",
    domain: "dsrpass.vercel.app",
    image: dsrpass,
    alt: "冬山河漫遊護照 App 內導覽畫面：花精靈旅伴站在冬山河親水公園，下方是景點介紹、路線地圖與集章",
    phone: true,
  },
];

export default function LiveProjects() {
  return (
    <div className={styles.live}>
      <div className={styles.liveHeading}>
        <h3 id="live-title">真實案例</h3>
        <p>替真實客戶做好、已經上線的網站與服務。</p>
      </div>
      <ul className={styles.liveGrid}>
        {projects.map((project, index) => (
          <li key={project.href}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.workCard}
            >
              <div
                className={`${styles.workImage} ${styles.liveImage} ${
                  project.phone ? styles.livePhone : ""
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  sizes={
                    project.phone
                      ? "(max-width: 760px) 45vw, 24vw"
                      : "(max-width: 760px) 84vw, 40vw"
                  }
                />
                <span className={styles.visit}>
                  {project.domain} ↗
                  <span className={styles.srOnly}>（另開新視窗）</span>
                </span>
              </div>
              <div className={styles.workMeta}>
                <span>LIVE {String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
              <h4 className={styles.liveTitle}>
                {project.name} <span>{project.latin}</span>
              </h4>
              <p>{project.summary}</p>
              <span className={`${styles.workTags} ${styles.liveDid}`}>
                <b>我們做的</b>
                {project.tags}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
