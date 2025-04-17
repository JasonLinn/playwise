import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[rgb(var(--primary-color))]">智遊工作室</span>
              <br />
              讓工作更輕鬆，讓生活更自由
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              我們是一群熱愛效率與創意的夥伴，幫助小型品牌、個人工作者、民宿、店家，把繁瑣的日常工作變得更聰明、更簡單。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#services" className="btn-primary text-center">
                了解我們的服務
              </Link>
              <Link href="https://lin.ee/N4ukE55" target="_blank" className="btn-secondary text-center">
                立即諮詢
              </Link>
            </div>
          </div>
          
          <div className="relative h-72 md:h-96 lg:h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-center px-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">把時間花在真正重要的事上</h2>
                <p className="text-lg">讓我們幫你處理繁瑣的流程與事務</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 