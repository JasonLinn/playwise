import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-[#faf9f6] pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p className="text-xs font-semibold text-[#e8602c] tracking-widest uppercase mb-6">
              智遊工作室 · 宜蘭
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight text-[#1a1816] mb-7">
              讓工作更聰明，<br />
              讓生活多點餘裕。
            </h1>
            <p className="text-[15px] text-[#5c5a58] leading-[1.85] mb-10 max-w-[420px]">
              我們幫助民宿、小店家、自由工作者，把重複的日常雜事交給自動化系統——讓你把時間留在真正重要的事情上。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/#services" className="btn-primary">
                了解服務內容
              </Link>
              <Link href="https://lin.ee/N4ukE55" target="_blank" className="btn-secondary">
                免費諮詢 →
              </Link>
            </div>
          </div>

          {/* Right — feature list panel */}
          <div className="bg-white border border-[#e8e4df] p-8 lg:p-10 lg:mt-4">
            <p className="text-[10px] font-bold text-[#b0aba5] tracking-[0.15em] uppercase mb-7">
              我們能幫你的事
            </p>
            <div className="divide-y divide-[#f0ede9]">
              {[
                {
                  n: '01',
                  title: '自動化繁瑣流程',
                  desc: '表單自動回覆、訂單整理、定時推播提醒，讓事情自己動起來。',
                },
                {
                  n: '02',
                  title: 'LINE 智慧客服助理',
                  desc: '24 小時回覆常見問題、引導預約報名，符合你的品牌語氣。',
                },
                {
                  n: '03',
                  title: '一對一工作流程規劃',
                  desc: '不確定從哪裡開始也沒關係，陪你聊清楚，找出最簡單的解法。',
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-5 py-6">
                  <span className="text-xs font-bold text-[#e8602c] shrink-0 mt-0.5">{item.n}</span>
                  <div>
                    <div className="text-sm font-bold text-[#1a1816] mb-1">{item.title}</div>
                    <div className="text-xs text-[#7a7674] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
