import Link from 'next/link';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#1a1816]">
      <div className="container-custom">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold text-[#5c5a58] tracking-[0.15em] uppercase mb-6">Contact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            想聊聊你的需求？
          </h2>
          <p className="text-[15px] text-[#8a8684] leading-relaxed mb-10">
            每個品牌的狀況都不同，我們希望先了解你，再提供最適合的建議。加 LINE 好友，跟我們說說你的情況。
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="https://lin.ee/N4ukE55"
              target="_blank"
              className="inline-flex items-center justify-center bg-[#e8602c] hover:bg-[#d4552a] text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              加入 LINE 好友
            </Link>
            <a href="tel:0928836163" className="text-sm text-[#5c5a58] hover:text-white transition-colors">
              0928-836-163
            </a>
          </div>

          <p className="text-xs text-[#3c3a38]">
            宜蘭縣冬山鄉武淵三路 120 號
          </p>
        </div>
      </div>
    </section>
  );
}
