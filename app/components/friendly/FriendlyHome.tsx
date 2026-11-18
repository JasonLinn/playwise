import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiExternalLink,
  FiHome,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiMonitor,
  FiPhone,
  FiRepeat,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import yilanpass from "../../../public/images/studio/live/yilanpass.jpg";
import jinbnb from "../../../public/images/studio/live/jinbnb.jpg";
import dsrpass from "../../../public/images/studio/live/dsrpass.jpg";
import tide from "../../../public/images/studio/tide.jpg";
import mist from "../../../public/images/studio/mist.jpg";
import laundryLiff from "../../../public/images/studio/live/laundry-liff.jpg";

const LINE_URL = "https://lin.ee/N4ukE55";
const MAP_URL = "https://maps.app.goo.gl/V3uCz1jLPCUB6L4L7";

const nav = [
  ["#services", "服務項目"],
  ["#cases", "作品案例"],
  ["#clients", "適合對象"],
  ["#process", "合作流程"],
  ["#contact", "聯絡我們"],
];

const services = [
  {
    icon: FiMonitor,
    title: "品牌網站設計",
    description:
      "把你的品牌、服務和特色，整理成一個清楚、好看、手機也好用的網站，讓客人一進來就知道你在做什麼、怎麼聯絡你。",
    items: ["民宿官網、店家網站", "舊網站改版", "訂房與 LINE 入口整合"],
    link: ["#cases", "看真實案例"],
  },
  {
    icon: FiMessageCircle,
    title: "LINE 服務與智慧客服",
    description:
      "想讓你的 LINE 有個會回答問題的小幫手嗎？常見問題客人一問就答，還能引導預約、報名或查詢；需要你判斷的，再交給你接手。",
    items: ["LINE 登入、領券、集章", "LINE 線上訂單", "常見問答與人工接手"],
    link: ["/works/laundry", "試用 LINE 訂單原型"],
  },
  {
    icon: FiRepeat,
    title: "工作流程自動化",
    description:
      "每天都在重複做一樣的事？我們幫你把表單、預約、提醒串起來，讓事情「自己動起來」，你可以把時間花在更重要的事上。",
    items: ["表單送出後自動通知", "自動整理客戶名單或訂單", "固定時間發訊息、做提醒"],
    link: ["#contact", "聊聊你的流程"],
  },
];

type LiveCase = {
  name: string;
  type: string;
  summary: string;
  did: string[];
  href: string;
  domain: string;
  image: StaticImageData;
  alt: string;
  phone?: boolean;
};

const cases: LiveCase[] = [
  {
    name: "宜蘭旅遊通",
    type: "在地旅遊平台",
    summary:
      "宜蘭觀光民宿行銷協會發起的旅遊平台。整合在地店家電子優惠券、合法民宿查詢與活動資訊，用 LINE 登入就能領券。",
    did: ["平台設計與開發", "LINE 登入領券", "優惠券與民宿查詢"],
    href: "https://yilanpass.com",
    domain: "yilanpass.com",
    image: yilanpass,
    alt: "宜蘭旅遊通首頁：先領券再出發的搜尋區與熱門優惠券列表",
  },
  {
    name: "衿日林民宿",
    type: "民宿官網",
    summary:
      "冬山河畔的包棟民宿官網。介紹房型與設施、刊登專屬優惠與最新消息，並把官網訂房與 LINE 好友放在客人找得到的地方。",
    did: ["官網設計與開發", "最新消息後台", "訂房與 LINE 入口"],
    href: "https://jinbnb.com",
    domain: "jinbnb.com",
    image: jinbnb,
    alt: "衿日林民宿官網首頁：戲水池主視覺與最新消息",
  },
  {
    name: "冬山河漫遊護照",
    type: "LINE 集章服務",
    summary:
      "沿冬山河散步或騎單車的數位護照。用 LINE 開啟後，旅伴角色帶路介紹每一站，到了現場用 GPS 集章，沿途收集旅印。",
    did: ["LINE LIFF 開發", "GPS 集章", "景點導覽頁"],
    href: "https://dsrpass.vercel.app",
    domain: "dsrpass.vercel.app",
    image: dsrpass,
    alt: "冬山河漫遊護照 App 內導覽畫面：花精靈旅伴站在冬山河親水公園，下方是景點介紹、路線地圖與集章",
    phone: true,
  },
];

const demos = [
  {
    title: "潮間 Between Tides",
    description: "台東海邊民宿官網示範，搭配潮汐互動、日期選擇與房費試算。",
    href: "/works/tide",
    image: tide as StaticImageData | string,
  },
  {
    title: "霧裡山房 Mist House",
    description: "坪林茶宿官網示範，搭配節氣選擇、泡茶計時與房費試算。",
    href: "/works/mist",
    image: mist as StaticImageData | string,
  },
  {
    title: "日式民宿",
    description: "以檜木為主題的日式風格民宿網站示範。",
    href: "/works/bnb",
    image:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=900&h=600&fit=crop",
  },
  {
    title: "洗務通 WashPass",
    description: "洗被單廠的訂單與排程系統展示，民宿用 LINE 預約、廠端批次審核。",
    href: "/works/washpass",
    image:
      "https://images.unsplash.com/photo-1635274605638-d44babc08a4f?w=900&h=600&fit=crop",
  },
];

const clients = [
  {
    icon: FiHome,
    title: "民宿 / 小店家 / 創作者",
    description:
      "讓預約、訂單、客服這些日常工作自動化，省下時間與精力，專注在經營體驗與創作。",
    example: "例如：衿日林民宿官網",
  },
  {
    icon: FiUser,
    title: "一人公司 / 自由接案者",
    description:
      "把重複性的行政流程交給自動化系統，讓你能專注在核心價值，同時維持專業形象。",
    example: "例如：表單、報價、提醒自動化",
  },
  {
    icon: FiUsers,
    title: "小型協會 / 社群 / 團隊",
    description:
      "簡化會員、活動與通知的管理，讓成員間溝通與管理更加順暢。",
    example: "例如：宜蘭旅遊通（協會平台）",
  },
];

const steps = [
  ["聊聊現在", "了解你的客人、工作方式，以及最想改善的問題。沒有規格書，也可以開始。"],
  ["一起釐清", "確認服務範圍、所需素材、費用與時程。先把期待說清楚，再進入製作。"],
  ["做出來，試著用", "從設計到開發，透過預覽與實際操作調整細節，確認手機上也順手。"],
  ["上線，也交接", "確認內容與功能後上線，說明日常操作；後續維護依約定的範圍進行。"],
];

const faqs = [
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
];

const blue = "text-[#1a73e8]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#1a73e8] px-5 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1662c4]";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-md border border-[#1a73e8] bg-white px-5 py-3 text-base font-semibold text-[#1a73e8] transition-colors hover:bg-blue-50";
const container = "mx-auto max-w-6xl px-5 sm:px-8";

function NewTab() {
  return <span className="sr-only">（另開新視窗）</span>;
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
      <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
      <p className="text-lg text-gray-600">{sub}</p>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className={`${container} flex h-16 items-center justify-between gap-4`}>
        <a href="#top" className="flex items-center gap-2">
          <span className={`text-xl font-bold md:text-2xl ${blue}`}>智遊工作室</span>
          <span className="hidden text-sm text-gray-400 sm:inline">Playwise</span>
        </a>
        <nav aria-label="主要導覽" className="hidden items-center gap-7 lg:flex">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="text-gray-700 transition-colors hover:text-[#1a73e8]">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} px-4 py-2 text-sm`}>
            LINE 諮詢
            <NewTab />
          </a>
          <details className="group relative lg:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 [&::-webkit-details-marker]:hidden"
              aria-label="開啟選單"
            >
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </summary>
            <nav
              aria-label="手機導覽"
              className="absolute right-0 top-12 w-48 rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
            >
              {nav.map(([href, label]) => (
                <a key={href} href={href} className="block rounded-md px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1a73e8]">
                  {label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function HeroCollage() {
  return (
    <a
      href="#cases"
      aria-label="看已上線的真實案例：衿日林民宿、宜蘭旅遊通、冬山河漫遊護照"
      className="group relative block aspect-[1.1] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400 to-teal-400 shadow-xl"
    >
      <div className="absolute right-[5%] top-[15%] w-[66%] overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex h-5 items-center gap-1 border-b border-gray-100 px-2" aria-hidden="true">
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
        <Image src={jinbnb} alt="" sizes="(max-width: 1024px) 60vw, 30vw" loading="eager" />
      </div>
      <div className="absolute left-[5%] top-[44%] w-[66%] overflow-hidden rounded-lg bg-white shadow-xl transition-transform duration-500 group-hover:translate-x-[-4px]">
        <div className="flex h-5 items-center gap-1 border-b border-gray-100 px-2" aria-hidden="true">
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <i className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
        <Image src={yilanpass} alt="" sizes="(max-width: 1024px) 60vw, 30vw" loading="eager" fetchPriority="high" />
      </div>
      <div className="absolute bottom-[6%] right-[6%] w-[22%] overflow-hidden rounded-[18px] border-4 border-gray-800 bg-white shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
        <Image src={dsrpass} alt="" sizes="(max-width: 1024px) 22vw, 12vw" loading="eager" className="aspect-[0.47] object-cover object-top" />
      </div>
      <span className="absolute left-[5%] top-[6%] rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow sm:text-sm">
        已上線的真實作品
      </span>
    </a>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-14 md:py-20">
      <div className={`${container} grid grid-cols-1 items-center gap-12 lg:grid-cols-2`}>
        <div>
          <p className={`mb-4 text-base font-semibold ${blue}`}>智遊工作室｜宜蘭</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            讓工作更輕鬆，
            <br />
            讓生活更自由
          </h1>
          <p className="mb-6 max-w-xl text-lg leading-relaxed text-gray-700">
            我們幫民宿、小店、個人工作者和在地協會做
            <strong className="text-gray-900">網站、LINE 服務與自動化流程</strong>
            ，把繁瑣的日常工作變得更聰明、更簡單。不懂技術也沒關係，從你每天最花時間的事聊起就好。
          </p>
          <ul className="mb-8 flex flex-wrap gap-2" aria-label="服務項目">
            {["品牌網站", "LINE 服務", "流程自動化"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100">
                <FiCheck className={`h-4 w-4 ${blue}`} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#services" className={btnPrimary}>
              了解我們的服務
            </a>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
              LINE 立即諮詢
              <NewTab />
            </a>
          </div>
          <a href="#cases" className="mt-6 inline-flex flex-wrap items-center gap-2 text-sm text-gray-600 hover:text-[#1a73e8]">
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">已上線</span>
            宜蘭旅遊通 · 衿日林民宿 · 冬山河漫遊護照
          </a>
        </div>
        <HeroCollage />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-gray-50 py-20">
      <div className={container}>
        <SectionTitle title="我們可以幫你做什麼？" sub="讓繁瑣的流程自動化，專注在真正重要的事上" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map(({ icon: Icon, title, description, items, link }) => (
            <article key={title} className="flex flex-col rounded-lg bg-white p-8 shadow-md transition-shadow hover:shadow-lg">
              <Icon className={`mb-4 h-8 w-8 ${blue}`} aria-hidden="true" />
              <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
              <p className="mb-5 text-gray-600">{description}</p>
              <ul className="mb-6 space-y-2 text-gray-700">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-teal-500" aria-hidden="true">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={link[0]} prefetch={false} className={`mt-auto inline-flex items-center gap-1 font-semibold ${blue} hover:underline`}>
                {link[1]}
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases() {
  return (
    <section id="cases" className="scroll-mt-16 bg-white py-20">
      <div className={container}>
        <SectionTitle title="真實案例" sub="替真實客戶做好、已經上線的網站與服務" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cases.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-xl"
            >
              <div
                className={`relative flex aspect-[1.5] items-center justify-center overflow-hidden ${
                  item.phone ? "bg-gradient-to-br from-blue-100 to-teal-100 py-4" : "bg-gray-100"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  sizes={item.phone ? "(max-width: 768px) 40vw, 12vw" : "(max-width: 768px) 92vw, 33vw"}
                  className={
                    item.phone
                      ? "h-full w-auto rounded-xl border-[3px] border-gray-800 object-cover object-top shadow-lg"
                      : "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  }
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="mb-2 inline-block self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1a73e8]">
                  {item.type}
                </span>
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-[#1a73e8]">{item.name}</h3>
                <p className="mb-4 text-gray-600">{item.summary}</p>
                <p className="mb-1 text-sm font-semibold text-gray-900">我們做的</p>
                <ul className="mb-5 flex flex-wrap gap-1.5">
                  {item.did.map((d) => (
                    <li key={d} className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-700">
                      {d}
                    </li>
                  ))}
                </ul>
                <span className={`mt-auto inline-flex items-center gap-1 text-sm font-semibold ${blue}`}>
                  {item.domain}
                  <FiExternalLink className="h-4 w-4" aria-hidden="true" />
                  <NewTab />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demos() {
  return (
    <section id="portfolio" className="scroll-mt-16 bg-gray-50 py-20">
      <div className={container}>
        <SectionTitle title="設計示範與互動原型" sub="點進去可以實際操作，感受網站和系統用起來的樣子" />
        <Link
          href="/works/laundry"
          prefetch={false}
          className="group mb-8 grid grid-cols-1 overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg md:grid-cols-2"
        >
          <div className="p-8 md:p-10">
            <span className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">可以試用</span>
            <h3 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-[#1a73e8]">洗衣廠 LINE 訂單原型</h3>
            <p className="mb-5 text-gray-600">
              品項、數量、取送時間散在對話裡，容易反覆確認。我們把這些資訊收進同一段流程，送出前再讓客人核對。
            </p>
            <ul className="mb-6 space-y-2 text-gray-700">
              {["調整品項數量", "選擇取送日期與時段", "送出前檢查金額與訂單摘要"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <FiCheck className="h-4 w-4 text-teal-500" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <span className={`inline-flex items-center gap-1 font-semibold ${blue}`}>
              試用洗衣訂單原型
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
          <div className="flex items-end justify-center bg-gradient-to-br from-blue-400 to-teal-400 px-8 pt-10">
            <div className="h-[330px] w-[220px] overflow-hidden rounded-t-[30px] border-[6px] border-b-0 border-gray-800 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 md:h-[370px] md:w-[240px]">
              <Image
                src={laundryLiff}
                alt="洗衣廠 LINE 訂單原型畫面：選擇送洗衣物，已選襯衫與床單被套"
                sizes="240px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              prefetch={false}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[1.5] overflow-hidden bg-gray-100">
                <Image
                  src={demo.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-bold text-gray-900 group-hover:text-[#1a73e8]">{demo.title}</h3>
                <p className="text-sm text-gray-600">{demo.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">以上為設計示範與原型，用來展示設計與互動，不提供實際訂房或下單。</p>
      </div>
    </section>
  );
}

function Clients() {
  return (
    <section id="clients" className="scroll-mt-16 bg-white py-20">
      <div className={container}>
        <SectionTitle
          title="我們最常協助的對象"
          sub="不論你是經營小店、自由工作者，還是小型團隊，我們都能為你量身打造最適合的解決方案"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {clients.map(({ icon: Icon, title, description, example }) => (
            <div key={title} className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow">
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ${blue}`}>
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
              <p className="mb-4 text-gray-600">{description}</p>
              <p className="text-sm font-medium text-teal-700">{example}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="scroll-mt-16 bg-gray-50 py-20">
      <div className={container}>
        <SectionTitle title="合作流程" sub="先聊生活，再聊技術。沒有規格書也可以開始" />
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], index) => (
            <li key={title} className="rounded-lg bg-white p-6 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1a73e8] font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-14 max-w-3xl">
          <h3 className="mb-5 text-center text-2xl font-bold text-gray-900">常見問題</h3>
          <div className="space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-lg bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className={`text-xl transition-transform group-open:rotate-45 ${blue}`} aria-hidden="true">＋</span>
                </summary>
                <p className="mt-3 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 py-20">
      <div className={container}>
        <div className="grid grid-cols-1 overflow-hidden rounded-xl bg-white shadow-lg md:grid-cols-[1.4fr_1fr]">
          <div className="p-10 md:p-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">想知道我們能怎麼幫你？</h2>
            <p className="mb-6 text-lg text-gray-600">
              每個品牌、每位工作者的需求都不同，我們希望能了解你的情況，提供最適合你的解決方案。歡迎加入我們的 LINE，一起聊聊！
            </p>
            <div className="mb-8 space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <FiPhone aria-hidden="true" />
                電話：
                <a href="tel:0928836163" className={`${blue} hover:underline`}>0928-836-163</a>
              </p>
              <p className="flex items-center gap-2">
                <FiMapPin aria-hidden="true" />
                地址：
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className={`${blue} hover:underline`}>
                  宜蘭縣冬山鄉武淵三路120號
                  <NewTab />
                </a>
              </p>
            </div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#06c755] px-6 py-3 text-base font-bold text-[#0b2612] transition-colors hover:bg-[#05b04b] md:w-auto"
            >
              加入 LINE 好友
              <NewTab />
            </a>
          </div>
          <div className="flex flex-col justify-center bg-gradient-to-br from-blue-400 to-teal-400 p-10 text-white md:p-12">
            <h3 className="mb-4 text-2xl font-bold">第一則訊息，可以這樣開始</h3>
            <ul className="space-y-2 text-white/95">
              <li>・我經營／從事：</li>
              <li>・目前網站或品牌名稱（選填）：</li>
              <li>・最想改善的問題：</li>
              <li>・希望完成的時間（選填）：</li>
            </ul>
            <p className="mt-5 text-sm text-white/90">不用寫得很完整，我們會先陪你釐清需求，再討論做法、範圍與報價。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 py-12 text-white">
      <div className={container}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="mb-4 text-xl font-bold">智遊工作室</h2>
            <p className="mb-2 text-gray-300">讓工作更輕鬆，讓生活更自由</p>
            <p className="text-sm text-gray-400">營業人名稱：智遊工作室 · 統一編號：60165085</p>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold">快速連結</h2>
            <ul className="space-y-2">
              {nav.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-gray-300 hover:text-white">{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold">聯絡我們</h2>
            <div className="mb-4 space-y-2 text-gray-300">
              <p>
                電話：<a href="tel:0928836163" className="hover:text-white">0928-836-163</a>
              </p>
              <p>
                地址：
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  宜蘭縣冬山鄉武淵三路120號
                  <NewTab />
                </a>
              </p>
            </div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-[#06c755] px-4 py-2 font-semibold text-[#0b2612] hover:bg-[#05b04b]"
            >
              加入 LINE 好友
              <NewTab />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} 智遊工作室. 保留所有權利。</p>
        </div>
      </div>
    </footer>
  );
}

export default function FriendlyHome() {
  return (
    <div id="top" className="min-h-screen bg-white text-gray-900 [scroll-behavior:smooth]">
      <a
        href="#main-content"
        className="absolute left-4 top-[-100px] z-50 rounded bg-gray-900 px-4 py-2 text-white focus:top-3"
      >
        跳至主要內容
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Services />
        <Cases />
        <Demos />
        <Clients />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
