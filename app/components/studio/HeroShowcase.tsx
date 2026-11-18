import Image, { type StaticImageData } from "next/image";
import yilanpass from "../../../public/images/studio/live/yilanpass.jpg";
import jinbnb from "../../../public/images/studio/live/jinbnb.jpg";
import dsrpass from "../../../public/images/studio/live/dsrpass.jpg";
import styles from "./studio.module.css";

type Shot = {
  kind: "back" | "front" | "phone";
  image: StaticImageData;
  domain: string;
  type: string;
  name: string;
  alt: string;
};

const shots: Shot[] = [
  {
    kind: "back",
    image: jinbnb,
    domain: "jinbnb.com",
    type: "民宿官網",
    name: "衿日林民宿",
    alt: "衿日林民宿官網首頁",
  },
  {
    kind: "front",
    image: yilanpass,
    domain: "yilanpass.com",
    type: "旅遊平台",
    name: "宜蘭旅遊通",
    alt: "宜蘭旅遊通首頁與優惠券列表",
  },
  {
    kind: "phone",
    image: dsrpass,
    domain: "dsrpass.vercel.app",
    type: "LINE 服務",
    name: "冬山河漫遊護照",
    alt: "冬山河漫遊護照 App 內導覽畫面",
  },
];

const kindClass = {
  back: styles.shotBack,
  front: styles.shotFront,
  phone: styles.shotPhone,
};

export default function HeroShowcase() {
  return (
    <figure className={styles.showcase}>
      <a
        href="#portfolio"
        className={styles.showcaseStage}
        aria-label="看已上線的真實案例：衿日林民宿、宜蘭旅遊通、冬山河漫遊護照"
      >
        {shots.map((shot) => (
          <div key={shot.domain} className={`${styles.shot} ${kindClass[shot.kind]}`}>
            <div className={styles.shotFrame}>
              {shot.kind !== "phone" && (
                <div className={styles.shotBar} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{shot.domain}</span>
                </div>
              )}
              <Image
                src={shot.image}
                alt={shot.alt}
                sizes={
                  shot.kind === "phone"
                    ? "(max-width: 760px) 30vw, 14vw"
                    : "(max-width: 760px) 70vw, 34vw"
                }
                loading="eager"
                fetchPriority={shot.kind === "front" ? "high" : "auto"}
              />
            </div>
            <span className={styles.shotChip} aria-hidden="true">
              <b>{shot.type}</b>
              {shot.name}
            </span>
          </div>
        ))}
      </a>
      <figcaption className={styles.showcaseCaption}>
        <span>FIG. 01 — 已上線的作品</span>
        <a href="#portfolio">看全部案例 ↓</a>
      </figcaption>
    </figure>
  );
}
