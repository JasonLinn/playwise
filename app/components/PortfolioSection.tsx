import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioSection() {
  const works = [
    {
      title: '日式民宿',
      description: '以檜木為主題的日式風格民宿，融合日式美學與現代簡約，提供舒適寧靜的住宿體驗。',
      image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=900&h=1200&fit=crop',
      link: '/works/bnb',
      tags: ['Website', 'Design', 'RWD'],
    },
    {
      title: '洗衣廠 LIFF 訂單系統',
      description: '整合 LINE LIFF，讓用戶在 LINE 內直接完成送洗選擇、取件預約與付款，全程自動推播通知。',
      image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=900&h=1200&fit=crop',
      link: '/works/laundry',
      tags: ['LINE LIFF', '自動化', '訂單系統'],
    },
    {
      title: "洗務通 WashPass",
      description: "專為大型洗被單廠打造的數位化 SaaS 系統，串接 LINE LIFF 讓民宿業者一鍵完成預約，廠端後台批次審核輕鬆排程。",
      image: 'https://images.unsplash.com/photo-1635274605638-d44babc08a4f?w=900&h=1200&fit=crop',
      link: "/works/washpass",
      tags: ["SaaS", "B2B", "Full-Stack"]
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-white border-t border-[#e8e4df]">
      <div className="container-custom">

        <div className="mb-14">
          <p className="text-[10px] font-bold text-[#b0aba5] tracking-[0.15em] uppercase mb-4">Portfolio</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1816]">精選作品</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {works.map((work, index) => (
            <Link
              href={work.link}
              key={index}
              className="group bg-white block overflow-hidden border border-[#e8e4df]"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-semibold tracking-wide text-[#7a7674] uppercase border border-[#e8e4df] px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-bold text-[#1a1816] mb-2 group-hover:text-[#e8602c] transition-colors">
                  {work.title}
                </h3>
                <p className="text-sm text-[#5c5a58] leading-relaxed line-clamp-2">{work.description}</p>
                <div className="mt-5 text-xs font-semibold text-[#e8602c] flex items-center gap-1">
                  查看詳情
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
